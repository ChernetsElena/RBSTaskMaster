import { EMPLOYEE_WINDOW_TYPE } from '../employeesWindow/CEmployeesWindow.js';
import EmployeesButtonView from './EmployeesButtonView.js'


export class EmployeesButton {
    constructor(){
        this.view
        this.window
        this.showProjectsView
    }

    init(employeeWindow, showProjectsViewCB){
        this.window = employeeWindow
        this.showProjectsView = showProjectsViewCB
    }

    config() {
        return EmployeesButtonView()
    }

    attachEvents() {
        this.view = {
             toProjectsBtn: $$('employeeToProjectsBtn'),
             addEmployeeBtn: $$('employeeButtonAddBtn')
         }

        this.view.addEmployeeBtn.attachEvent("onItemClick", () => {
            this.showWindow()
        })

        this.view.toProjectsBtn.attachEvent("onItemClick", () => {
            this.showProjectsView()
        })
    }

    showWindow() {
        this.window.show(EMPLOYEE_WINDOW_TYPE.new)
    }
}
