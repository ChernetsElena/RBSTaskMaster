import ProjectsButtonView from './ProjectsButtonView.js';
import {PROJECT_WINDOW_TYPE } from '../projectWindow/CProjectsWindow.js';
import employeeModel from '../../../models/employeeModel.js'

export class ProjectsButton {
    constructor(){
        this.view
        this.window
        this.names
    }

    init(projectWindow) {
        this.window = projectWindow
    }
    
    config() {
        return ProjectsButtonView()
    }

    attachEvents() {
        this.view = {
            newProjectBtn: $$('projectsAddButton')
        }

        this.view.newProjectBtn.attachEvent("onItemClick", () => {
            this.showWindow()
        })
    }

    showWindow() {
        this.names = []
        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                this.names.push({id: `${employee.ID}`, value: `${employee.last_name} ${employee.name}`})
            })
            this.window.show(PROJECT_WINDOW_TYPE.new, this.names)
        })       
    }
}