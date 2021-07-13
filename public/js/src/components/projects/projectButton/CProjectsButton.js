import ProjectsButtonView from './ProjectsButtonView.js';
import {PROJECT_WINDOW_TYPE } from '../projectWindow/CProjectsWindow.js';
import employeeModel from '../../../models/employeeModel.js'

// компонент кнопки для работы с сущностью проекта
export class ProjectsButton {
    constructor(){
        this.view                   // объект для быстрого доступа к представлениям
        this.window                 // экземпляр окна для работы с проектами
        this.names                  // тимлиды
    }

    // метод инициализации компонента
    init(projectWindow) {
        this.window = projectWindow
    }

    // метод получения webix конфигурации компонента
    config() {
        return ProjectsButtonView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            newProjectBtn: $$('projectsAddButton')
        }

         // обрабтка события нажатия на кнопку "Добавить проект"
        this.view.newProjectBtn.attachEvent("onItemClick", () => {
            this.showWindow()
        })
    }

    // метод отображения окна
    showWindow() {
        this.names = []
        // обновление данных тимлидов
        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                this.names.push({id: `${employee.ID}`, value: `${employee.last_name} ${employee.name}`})
            })
            this.window.show(PROJECT_WINDOW_TYPE.new, this.names)
        })      
    }
}