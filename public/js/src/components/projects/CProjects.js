import ProjectsView from './ProjectsView.js';
import {ProjectsWindow, PROJECT_WINDOW_TYPE} from './projectWindow/CProjectsWindow.js';
import employeeModel from '../../models/employeeModel.js'
import projectModel from '../../models/projectModel.js';
import taskModel from '../../models/taskModel.js';

export class Project {
    constructor(){
        this.view
        this.window = new ProjectsWindow()
        this.tasks
        this.employees
        this.projectsButton
        this.names
        this.showTasksView
        this.clickTimeout
    }

    init (
        projectsButton, 
        tasks, 
        tasksButton, 
        employees, 
        employeesButton, 
        toolbar, 
        showProjectsViewCB, 
        showTasksViewCB,
        showEmployeesViewCB,
        onLogout) {
        this.showTasksView = showTasksViewCB
        this.projectsButton = projectsButton
        this.tasks = tasks
        this.employees = employees
        this.toolbar = toolbar

        this.tasks.init(tasksButton, showProjectsViewCB)

        this.employees.init(
            employeesButton, 
            showProjectsViewCB, 
            () => { 
                this.refreshView() 
            },
            toolbar, 
            showEmployeesViewCB,
            onLogout
        )

        this.projectsButton.init(this.window)

      
        this.window.init(
            () => { this.refreshView() }
        )

        this.clickTimeout = null
    }

    config() {
        webix.ui(this.window.config())
        return ProjectsView()
    }

    attachEvents() {
        this.view = {
            search: $$('projectsSearch'),
            projectsDv: $$('projectsDataview'),
        }

        this.window.attachEvents()

        this.refreshView()
        
        this.view.search.attachEvent("onTimedKeyPress",() => { 
            var value = this.view.search.getValue().toLowerCase(); 
            this.view.projectsDv.filter(function(obj){
              return obj.name.toLowerCase().indexOf(value)!=-1;
            })
        });


        this.view.projectsDv.attachEvent("onItemClick", (id) => {
            let select = this.view.projectsDv.getItem(id)
            
            projectModel.getProjectById(select.ID).then((selectedProject) => {
                
                if (this.clickTimeout) {
                    clearTimeout(this.clickTimeout)
                    this.clickTimeout = null
                    this.window.parse(selectedProject)
                    this.showWindow(PROJECT_WINDOW_TYPE.show);
                } else {
                    this.clickTimeout = setTimeout(() => {
                        this.clickTimeout = null
                        taskModel.getTasksByProjectId(select.ID).then((data) => {
                            this.tasks.refreshView(data, select.ID, selectedProject.color_one, selectedProject.color_two)   
                        })
                        this.showTasksView()
                    }, 500)
                    
                }

            })
            
        })
    }

    showWindow(type) {
        this.names = []
        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                this.names.push({id: `${employee.ID}`, value: `${employee.last_name} ${employee.name}`})
            })
            this.window.show(type, this.names)
        })
    }

    refreshView() {
        projectModel.getProjects().then((data) => {
            this.view.projectsDv.clearAll()
            this.view.projectsDv.parse(data)
        })
    }
}