import { EMPLOYEE_WINDOW_TYPE } from '../employeesWindow/CEmployeesWindow.js';
import EmployeesButtonView from './EmployeesButtonView.js'

// компонент кнопки для работы с сущностью сотрудника
export class EmployeesButton {
    constructor(){
        this.view                                   // объект для быстрого доступа к представлениям
        this.window                                 // экземпляр окна сотрудников
        this.showProjectsView                       // функция отображения вкладки проектов
        this.refreshProjects                        // функция обновления тимлидов проектов
    }

     // метод инициализации компонента
    init(employeeWindow, showProjectsViewCB, refreshProjectsCB){
        this.window = employeeWindow
        this.showProjectsView = showProjectsViewCB
        this.refreshProjects = refreshProjectsCB
    }

    // метод получения webix конфигурации компонента
    config() {
        return EmployeesButtonView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
             toProjectsBtn: $$('employeeToProjectsBtn'),
             addEmployeeBtn: $$('employeeButtonAddBtn')
        }

        //отображение окна для создания нового сотрудника
        this.view.addEmployeeBtn.attachEvent("onItemClick", () => {
            this.showWindow()
        })

        // отображение вкладки проектов
        this.view.toProjectsBtn.attachEvent("onItemClick", () => {
            this.refreshProjects()
            this.showProjectsView()
        })
    }

    //функция отображения окна для создания нового сотрудника
    showWindow() {
        this.window.show(EMPLOYEE_WINDOW_TYPE.new)
    }
}
