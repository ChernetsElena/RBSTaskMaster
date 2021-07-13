import ApplicationView from './ApplicationView.js';
import { Toolbar }  from "./toolbar/CToolbar.js";
import { Project } from "./projects/CProjects.js";
import { ProjectsButton } from "./projects/projectButton/CProjectsButton.js";
import { Employees } from "./employees/CEmployees.js";
import { EmployeesButton } from "./employees/employeesButton/CEmployeesButton.js";
import { Tasks } from "./tasks/CTasks.js";
import { TaskButton } from "./tasks/taskButton/CTasksButton.js";
import { CMainWindow } from './mainWindow/CMainWindow.js';
import { checkAuth } from '../../helpers/checkAuth.js'

// галвный компонент приложения
export class Application {
    constructor() {
        this.view                                       // быстрый доступ к объектам представлений
        this.toolbar = new Toolbar()                    // экземпляр контроллера тулбара
        this.projects = new Project()                   // экземпляр контроллера проетов
        this.projectsButton = new ProjectsButton()      // экземпляр контроллера кнопки проектов
        this.employees = new Employees()                // экземпляр контроллера сотрудников
        this.employeesButton = new EmployeesButton()    // экземпляр контроллера кнопки сотрудников
        this.tasks = new Tasks()                        // экземпляр контроллера задач
        this.tasksButton = new TaskButton()             // экземпляр контроллера кнопки задач
        this.mainWindow = new CMainWindow()             // окно входа в приложение
    }

    // метод инициализации главного компонента
    init(){

        // инициализация компонента вкладки проектов
        this.projects.init(
            this.projectsButton, 
            this.tasks,
            this.tasksButton,
            this.employees,
            this.employeesButton,
            this.toolbar,
            () => {
                $$('projectRow').hide()
                $$('employeeRow').hide()
                $$('tasksRow').hide()
                $$('projectRow').show()
            }, // функция отображает вкладку проектов
            () => {
                $$('projectRow').hide()
                $$('employeeRow').hide()
                $$('tasksRow').hide()
                $$('tasksRow').show()
            }, // функция отображает вкладку задач
            () => {
                $$('projectRow').hide()
                $$('employeeRow').hide()
                $$('tasksRow').hide()
                $$('employeeRow').show()
            }, // функция отображает вкладку сотрудников
            () => { location.replace('/user/logout')} // onLogout
            )
        // инициализация компонента окна входа в приложение
        this.mainWindow.init(
            () => { location.replace('/') }, // onLogin
        )
    }

    // метод вызова обработки событий
    attachEvents() {
        this.view = {
            workedPlace: $$('workedPlace'),
            appMultiview: $$('appMultiview'),
        }

        // компоненты требующие авторизации
        // вызываются через проверку авторизации
        // если клиент не авторизован, то эти
        // компоненты не будут отрисованы
        checkAuth((isAuth) => {
            if (isAuth) {

                // отрисовать рабочее пространство
                this.view.workedPlace.show()

                // обработчики событий компонентов
                this.projects.attachEvents()
                this.projectsButton.attachEvents()
                this.toolbar.attachEvents()
                this.tasks.attachEvents()
                this.tasksButton.attachEvents()
                this.employees.attachEvents()
                this.employeesButton.attachEvents()
            } else {
                this.view.workedPlace.hide()
            }
        })

        // вызов обработки событий окна входа в приложение
        this.mainWindow.attachEvents()

        // первоночальное состояние приложения
        this.view.workedPlace.hide()
        this.mainWindow.switch()
    }

    // метод отрисовки главной конфигурации представления
    config() {
        webix.ui(this.mainWindow.config())

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

