import { EMPLOYEE_WINDOW_TYPE } from '../employeesWindow/CEmployeesWindow.js';
import EmployeesButtonView from './EmployeesButtonView.js'


export class EmployeesButton {
    constructor(){
        this.view
        this.window
        this.showProjectsView
        this.refreshProjects
    }

    init(employeeWindow, showProjectsViewCB, refreshProjectsCB){
        this.window = employeeWindow
        this.showProjectsView = showProjectsViewCB
        this.refreshProjects = refreshProjectsCB
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
            this.refreshProjects()
            this.showProjectsView()
        })
    }

    showWindow() {
        this.window.show(EMPLOYEE_WINDOW_TYPE.new)
    }
}
