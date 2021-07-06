import ToolbarView from './ToolbarView.js';
import authModel from '../../models/authModel.js';
import employeeModel from '../../models/employeeModel.js';


export class Toolbar {
    constructor(){
        this.view
        this.showEmployeeView
        this.onLogout                       // callback функция при логауте пользователя
        this.employeeID
    }

    init(showEmployeeViewCB, onLogout) {
        this.showEmployeeView = showEmployeeViewCB
        this.onLogout = onLogout
    }

    // метод получения webix конфигурации компонента
    config() {
        return ToolbarView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
         // инициализация используемых представлений
        this.view = {
            toolbar: $$('toolbar'),
            userBtn: $$('toolbarUserButton'),
            employeesBtn: $$('toolbarEmployeesButton'),
            label: $$('toolbarLabel'),
            logoutBtn: $$('toolbarLogoutButton'),
        }

        this.view.employeesBtn.attachEvent("onItemClick", () => {
            this.showEmployeeView()
        })

        // отложенное обновление информации о пользователе
        authModel.getCurrentEmployee().then((employee) => {
            // проверка наличия данных
            if (!employee) {
                return
            } 

            this.employeeID = employee.ID
            this.view.userBtn.define("label", `${employee.last_name} ${employee.name}`)
            this.view.userBtn.resize()
        })

        // выход
        this.view.logoutBtn.attachEvent('onItemClick', () => {
            this.onLogout()
        })
    }

    // функция обновления информации о текущем пользователе
    refreshEmployeeLabel() {
        employeeModel.getEmployeeById(this.employeeID).then((employee) => {
            this.view.userBtn.define("label", `${employee.last_name} ${employee.name}`)
            this.view.userBtn.resize()
        })
    }
}
