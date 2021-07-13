import TaskButtonView from './TasksButtonView.js';
import { TASK_WINDOW_TYPE } from '../taskWindow/CTasksWindow.js'

// компонент кнопки для работы с сущностью задачи
export class TaskButton {
    constructor(){
        this.view                       // объект для быстрого доступа к представлениям
        this.window                     // экземпляр окна для работы с задачами
        this.showProjectsView           // callback функция для отображения таба проектов
    }

    // метод инициализации компонента
    init( projectWindow, showProjectsViewCB ) {
        this.window = projectWindow
        this.showProjectsView = showProjectsViewCB
    }

    // метод получения webix конфигурации компонента
    config() {
        return TaskButtonView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            toProjectsBtn: $$('tasksButtonToProjectsBtn'),
            newTaskBtn: $$('tasksButtonNewTaskBtn')
        }

        // обрабтка события нажатия на кнопку "добавить задачу"
        this.view.newTaskBtn.attachEvent("onItemClick", () => {
            this.showWindow()
        })

        // обрабтка события нажатия на кнопку "к проектам"
        this.view.toProjectsBtn.attachEvent("onItemClick", () => {
            this.showProjectsView()
        })
    }

    // метод отображения окна
    showWindow() {
        this.window.refresh()
        this.window.show(TASK_WINDOW_TYPE.create)
    }
} 