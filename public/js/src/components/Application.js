import ApplicationView from './ApplicationView.js';
import { Toolbar }  from "../components/toolbar/CToolbar.js";
import { Project } from "../components/projects/CProjects.js";
import { ProjectsButton } from "../components/projects/projectButton/CProjectsButton.js";
import { Employees } from "../components/employees/CEmployees.js";
import { EmployeesButton } from "../components/employees/employeesButton/CEmployeesButton.js";
import { Tasks } from "../components/tasks/CTasks.js";
import { TaskButton } from "../components/tasks/taskButton/CTasksButton.js";


export class Application {
    constructor() {
        this.view,
        this.toolbar = new Toolbar(),
        this.projects = new Project(),
        this.projectsButton = new ProjectsButton(),
        this.employees = new Employees(),
        this.employeesButton = new EmployeesButton(),
        this.tasks = new Tasks(),
        this.tasksButton = new TaskButton()
    }

    init(){
        this.toolbar.init(() => {
            $$('projectRow').hide()
            $$('employeeRow').hide()
            $$('tasksRow').hide()
            $$('employeeRow').show()
        })

        this.projects.init(
            this.projectsButton, 
            this.tasks,
            this.tasksButton,
            this.employees,
            this.employeesButton,
            () => {
                $$('projectRow').hide()
                $$('employeeRow').hide()
                $$('tasksRow').hide()
                $$('projectRow').show()
            },
            () => {
                $$('projectRow').hide()
                $$('employeeRow').hide()
                $$('tasksRow').hide()
                $$('tasksRow').show()
        })

        // this.employees.init(this.employeesButton, () => {
        //     $$('projectRow').hide()
        //     $$('employeeRow').hide()
        //     $$('tasksRow').hide()
        //     $$('projectRow').show()
        // })
    }

    attachEvents() {
        this.view = {
            workedPlace: $$('workedPlace'),
            appMultiview: $$('appMultiview'),
        }

        this.projects.attachEvents()
        this.projectsButton.attachEvents()
        this.toolbar.attachEvents()
        this.tasks.attachEvents()
        this.tasksButton.attachEvents()
        this.employees.attachEvents()
        this.employeesButton.attachEvents()
    }

    config() {
        return ApplicationView(
            this.toolbar, 
            this.projects, 
            this.projectsButton, 
            this.employees, 
            this.employeesButton, 
            this.tasks,
            this.tasksButton, 
        )
    }
}

