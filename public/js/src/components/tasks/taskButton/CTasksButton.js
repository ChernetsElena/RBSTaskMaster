import TaskButtonView from './TasksButtonView.js';
import { TASK_WINDOW_TYPE } from '../taskWindow/CTasksWindow.js'

export class TaskButton {
    constructor(){
        this.view
        this.window
        this.showProjectsView
        this.names
    }

    init( projectWindow, showProjectsViewCB ) {
        this.window = projectWindow
        this.showProjectsView = showProjectsViewCB
    }
    
    config() {
        return TaskButtonView()
    }

    attachEvents() {
        this.view = {
            toProjectsBtn: $$('tasksButtonToProjectsBtn'),
            newTaskBtn: $$('tasksButtonNewTaskBtn')
        }

        this.view.newTaskBtn.attachEvent("onItemClick", () => {
            this.showWindow()
        })

        this.view.toProjectsBtn.attachEvent("onItemClick", () => {
            this.showProjectsView()
        })
    }

    showWindow() {
        this.window.refresh()
        this.window.show(TASK_WINDOW_TYPE.create)
    }
} 