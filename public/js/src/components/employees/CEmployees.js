import EmployeesView from './EmployeesView.js'
import {EmployeesWindow, EMPLOYEE_WINDOW_TYPE} from './employeesWindow/CEmployeesWindow.js';
import employeeModel from '../../models/employeeModel.js'
import {FormatDate} from '../../../helpers/dateFormatter.js'


export class Employees {
    constructor(){
        this.view
        this.window = new EmployeesWindow()
        this.employeesButton
        this.FormatDate = FormatDate
    }
    
    init (employeesButton, showProjectsViewCB, refreshProjectsCB) {
        this.employeesButton = employeesButton
        this.employeesButton.init(this.window, showProjectsViewCB, refreshProjectsCB)
        this.window.init(
            () => { this.refreshView() }
        )
    }

    config() {
        webix.ui(this.window.config())
        return EmployeesView()
    }
    
    attachEvents() {
        this.view = {
            employeesTable: $$('employeeDatatable'),
        }

        this.window.attachEvents()

        this.refreshView()

        this.view.employeesTable.attachEvent("onItemClick", (id) => {
            
            let select = this.view.employeesTable.getItem(id)
            
            employeeModel.getEmployeeById(select.ID).then((selectedEmployee) => {
                
                selectedEmployee.birth = this.FormatDate(selectedEmployee.birth)

                if (id.column == 'edit') {
                    this.window.parse(selectedEmployee)
                    this.showWindow(EMPLOYEE_WINDOW_TYPE.update);
                }
                
                if (id.column == 'trash') {
                    this.window.parse(selectedEmployee)
                    this.showWindow(EMPLOYEE_WINDOW_TYPE.delete);
                }
            })
        })

    }

    showWindow(type) {
        this.window.show(type)
    }

    refreshView() {
        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                employee.birth = this.FormatDate(employee.birth)
            })
            this.view.employeesTable.clearAll()
            this.view.employeesTable.parse(data)
        })
    }
}
