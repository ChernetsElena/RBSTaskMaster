import ProjectsView from './ProjectsView.js';
import {ProjectsWindow, PROJECT_WINDOW_TYPE} from './projectWindow/CProjectsWindow.js';
import employeeModel from '../../models/employeeModel.js'
import projectModel from '../../models/projectModel.js';
import taskModel from '../../models/taskModel.js';

// класс таба 'Проекты'
export class Project {
    constructor(){
        this.view                               // объект для быстрого доступа к представлениям
        this.window = new ProjectsWindow()      // экземпляр окна для работы с проектами
        this.tasks                              // экземпляр таба задач
        this.employees                          // экземпляр таба сотрудников
        this.projectsButton                     // экземпляр кнопки для работы с проектами
        this.names                              // сотрудники
        this.showTasksView                      // функция перехода к табу задач
        this.clickTimeout                       // переменная для подсчета кликов
    }

    // метод инициализации компонента
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

        // вызов инициализации таба задач
        this.tasks.init(tasksButton, showProjectsViewCB)

        // вызов инициализации таба сотрудников
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

        // вызов инициализации компонента кнопки проектов
        this.projectsButton.init(this.window)

      
        // вызов инициализации компонента окна
        this.window.init(
            () => { this.refreshView() }
        )

        this.clickTimeout = null
    }

    // метод получения webix конфигурации компонента
    config() {
        webix.ui(this.window.config())

        // вызов функции представления
        return ProjectsView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            search: $$('projectsSearch'),
            projectsDv: $$('projectsDataview'),
        }

        // инициализация обработчиков событий модального окна
        this.window.attachEvents()

        // загрузка первичных данных
        this.refreshView()
        
        // обработка события введения текста в строку поиска
        this.view.search.attachEvent("onTimedKeyPress",() => { 
            var value = this.view.search.getValue().toLowerCase(); 
            this.view.projectsDv.filter(function(obj){
              return obj.name.toLowerCase().indexOf(value)!=-1;
            })
        });


        // обработка события нажатия на карточку проекта
        this.view.projectsDv.attachEvent("onItemClick", (id) => {
            // получение выбранного элемента
            let select = this.view.projectsDv.getItem(id)
            
            projectModel.getProjectById(select.ID).then((selectedProject) => {
                
                //если один клик мыши отобразить таб задач, если два клика - вызвать модальное окно 
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

    // метод отображения модального окна
    showWindow(type) {
        this.names = []
        // обновление данных тимлидов
        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                this.names.push({id: `${employee.ID}`, value: `${employee.last_name} ${employee.name}`})
            })
            this.window.show(type, this.names)
        })
    }

    // функция обновления виджета проектов
    refreshView() {
        projectModel.getProjects().then((data) => {
            this.view.projectsDv.clearAll()
            this.view.projectsDv.parse(data)
        })
    }
}