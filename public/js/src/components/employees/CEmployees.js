import EmployeesView from './EmployeesView.js'
import {EmployeesWindow, EMPLOYEE_WINDOW_TYPE} from './employeesWindow/CEmployeesWindow.js';
import employeeModel from '../../models/employeeModel.js'
import {FormatDate} from '../../../helpers/dateFormatter.js'

// класс таба 'Сотрудники'
export class Employees {
    constructor(){
        this.view                               // объект для быстрого доступа к представлениям
        this.window = new EmployeesWindow()     // экземпляр окна для работы с сотрудниками, инициализация компонента окна
        this.employeesButton                    // экземпляр кнопки сотрудников
        this.toolbar                            // экземпляр тулбара
    }
    
    // метод инициализации компонента
    init (employeesButton, showProjectsViewCB, refreshProjectsCB, toolbar, showEmployeesViewCB, onLogout) {
        this.employeesButton = employeesButton
        this.toolbar = toolbar
        this.employeesButton.init(this.window, showProjectsViewCB, refreshProjectsCB) // вызов инициализации компонента кнопки сотрудников

        this.toolbar.init(showEmployeesViewCB, onLogout) // вызов инициализации компонента тулбара

        this.window.init(
            () => { 
                this.refreshView()
                this.toolbar.refreshEmployeeLabel() 
            },
            this.toolbar.onLogout
        ) // вызов инициализации компонента окна
    }

     // метод получения webix конфигурации компонента
    config() {
        // т.к. window расположен не в дереве приложения, а поверх слоев, его нужно отрисовывать отдельно
        webix.ui(this.window.config())
        // вызов функции представления
        return EmployeesView()
    }
    
    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            employeesTable: $$('employeeDatatable'),
        }

        // инициализация обработчиков событий модального окна
        this.window.attachEvents()

        // загрузка первичных данных в таблицу
        this.refreshView()

        // обработка события нажатия на кнопки удалить и редактировать
        this.view.employeesTable.attachEvent("onItemClick", (id) => {
            let select = this.view.employeesTable.getItem(id)
            employeeModel.getEmployeeById(select.ID).then((selectedEmployee) => {
                selectedEmployee.birth = FormatDate(selectedEmployee.birth)
                this.window.parse(selectedEmployee)
                //если нажата кнопка редактировать
                if (id.column == 'edit') {
                    //отображается окно обновления 
                    this.showWindow(EMPLOYEE_WINDOW_TYPE.update);
                }
                 //если нажата кнопка удалить
                if (id.column == 'trash') {
                     //отображается окно удаления 
                    this.showWindow(EMPLOYEE_WINDOW_TYPE.delete);
                }
            })
        })
    }

    //функция отображения окна
    showWindow(type) {
        this.window.show(type)
    }

    // функция обновления таблицы сотрудников
    refreshView() {
        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                employee.birth = FormatDate(employee.birth)
            })
            this.view.employeesTable.clearAll()
            this.view.employeesTable.parse(data)   
        })
    }
}
