import TasksView from './TasksView.js';
import { TaskWindow, TASK_WINDOW_TYPE } from './taskWindow/CTasksWindow.js';
import taskModel from '../../models/taskModel.js';
import employeeModel from '../../models/employeeModel.js';
import statusModel from '../../models/statusModel.js';
import urgentlyModel from '../../models/urgentlyModel.js';
import {StringToDate} from '../../../helpers/dateFormatter.js';

// класс таба 'задачи'
export class Tasks {
    constructor(){
        this.view                           // объект для быстрого доступа к представлениям
        this.window = new TaskWindow()      // экземпляр окна для работы с задачами
        this.tasksButton                    // экземпляр кнопки для работы с задачами
        this.names                          // исполнители
        this.projectId                      // id текущего проекта
        this.color_one                      // цвет проекта
        this.color_two                      // цвет проекта
        this.task_status                    // статусы задач
        this.task_urgently                  // срочность задач
    }

    // метод инициализации компонента
    init(tasksButton, showProjectsViewCB){
        // инициализация компонента окна
        ///this.window = new TaskWindow()

        this.tasksButton = tasksButton

        // вызова инициализации компонента кнопки
        this.tasksButton.init(this.window, showProjectsViewCB)

        // вызова инициализации компонента окна
        this.window.init(() => { 
            taskModel.getTasksByProjectId(this.projectId).then((data) => {
                this.refreshView(data, this.projectId, this.color_one, this.color_two) 
            })
        })

        this.names = []
        this.task_status = []
        this.task_urgently = []

    }

    // метод получения webix конфигурации компонента
    config() {
        webix.ui(this.window.config(this.names, this.task_status, this.task_urgently))
        // вызов функции представления
        return TasksView(this.task_status)
    }

    // метод инициализации обработчиков событий компонента
    attachEvents(){
        this.view = {
            container: $$('tasksContainer'),
            filterList: $$('filterList'),
            newList: $$('tasksNewList'),
            assignedList: $$('tasksAssignedList'),
            inJobList: $$('tasksInJobList'),
            coordinationList: $$('tasksCoordinationList'),
            doneList: $$('tasksDoneList'),
        }

        // подгрузка исполнителей
        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                this.names.push({id: `${employee.id}`, value: `${employee.last_name} ${employee.name}`})
            })
        })

        // подгрузка статусов
        statusModel.getStatuses().then((data) => {
            data.map((status) => {
                this.task_status.push({id: `${status.ID}`, value: `${status.value}`})
            })
        })

        // подгрузка срочностей
        urgentlyModel.getUrgently().then((data) => {
            data.map((urgently) => {
                this.task_urgently.push({id: `${urgently.ID}`, value: `${urgently.value}`})
            })
        })

        // инициализация обработчиков событий модального окна
        this.window.attachEvents()

        // обработка события введения текста в виджет фильтра
        this.view.filterList.attachEvent("onTimedKeyPress",() => { 
            var value = this.view.filterList.getValue().toLowerCase(); 
            this.view.newList.filter(function(obj){
                let name = obj.performer_name + ' ' + obj.performer_last_name + ' ' + obj.performer_name
                return name.toLowerCase().indexOf(value)!=-1;
            });
            this.view.assignedList.filter(function(obj){
                let name = obj.performer_name + ' ' + obj.performer_last_name + ' ' + obj.performer_name
                return name.toLowerCase().indexOf(value)!=-1;            
            });
            this.view.inJobList.filter(function(obj){
                let name = obj.performer_name + ' ' + obj.performer_last_name + ' ' + obj.performer_name
                return name.toLowerCase().indexOf(value)!=-1;
            });
            this.view.coordinationList.filter(function(obj){
                let name = obj.performer_name + ' ' + obj.performer_last_name + ' ' + obj.performer_name
                return name.toLowerCase().indexOf(value)!=-1;
            })
            this.view.doneList.filter(function(obj){
                let name = obj.performer_name + ' ' + obj.performer_last_name + ' ' + obj.performer_name
                return name.toLowerCase().indexOf(value)!=-1;
            })
        });

        // обработка события выбора задачи в списке новых задач
        this.view.newList.attachEvent("onSelectChange", (id) => {
            let select = this.view.newList.getItem(id)
            this.showSelectTask(select, TASK_WINDOW_TYPE.new, this.view.newList)
        })

        // обработка события выбора задачи в списке назначенных задач
        this.view.assignedList.attachEvent("onSelectChange", (id) => {
            let select = this.view.assignedList.getItem(id)
            this.showSelectTask(select, TASK_WINDOW_TYPE.assigned, this.view.assignedList)
        })
        
        // обработка события выбора задачи в списке задач в работе
        this.view.inJobList.attachEvent("onSelectChange", (id) => {
            let select = this.view.inJobList.getItem(id)
            taskModel.getTaskById(select.ID).then((selectTask) => {
                selectTask.plan_time = StringToDate(selectTask.plan_time)
                selectTask.fact_time = StringToDate(selectTask.fact_time)
                this.window.parse(selectTask)
                if (selectTask.status == TASK_STATUS.inJob){
                    this.showWindow(TASK_WINDOW_TYPE.inJob);
                }
                else {
                    this.showWindow(TASK_WINDOW_TYPE.pause);
                }
                this.view.inJobList.unselectAll();
            })
        })

        // обработка события выбора задачи в списке координации задач
        this.view.coordinationList.attachEvent("onSelectChange", (id) => {
            let select = this.view.coordinationList.getItem(id)
            this.showSelectTask(select, TASK_WINDOW_TYPE.coordination, this.view.coordinationList)
        })

        // обработка события выбора задачи в списке выполненных задач
        this.view.doneList.attachEvent("onSelectChange", (id) => {
            let select = this.view.doneList.getItem(id)
            this.showSelectTask(select, TASK_WINDOW_TYPE.done, this.view.doneList)
        })
    }

    // функция вызыва модального окна
    showWindow(type) {
        this.window.refresh()
        this.window.show(type)
    }

    // функция вызывает окно необходимого типа для выбранной задачи
    showSelectTask(select, type, list) {
        // получение выбранной задачи
        taskModel.getTaskById(select.ID).then((selectTask) => {
            selectTask.plan_time = StringToDate(selectTask.plan_time)
            selectTask.fact_time = StringToDate(selectTask.fact_time)
            this.window.parse(selectTask)
            this.showWindow(type);
            list.unselectAll();
        })
    }

    // функция обновления таба задач
    refreshView(tasksData, projectId, color_one, color_two) {
        
        this.projectId = projectId
        this.color_one = color_one
        this.color_two = color_two
        
        // установка id выбранного проекта к окну задач
        this.window.setId(projectId)

        // очистка списков задач
        this.view.newList.clearAll()
        this.view.assignedList.clearAll()
        this.view.inJobList.clearAll()
        this.view.coordinationList.clearAll()
        this.view.doneList.clearAll()

        // цвет фона таба задач выбирается в зависимости от цветов проекта, которому принадлежат задачи
        document.querySelector('.bg').style.background = `linear-gradient(-45deg, ${this.color_one}, ${this.color_two})`;
        
        if (tasksData != null) {
            let newTasks = []
            let assignedTasks = []
            let inJobTasks = []
            let coordinationTasks = []
            let doneTasks = []

            // заполнение списков задач в зависимости от их статуса
            tasksData.map((task) => {
                if (task.status == TASK_STATUS.new) {
                    newTasks.push(task)
                } 
                if (task.status == TASK_STATUS.assigned) {
                    assignedTasks.push(task)
                }
                if (task.status == TASK_STATUS.inJob) {
                    inJobTasks.push(task)
                }
                if (task.status == TASK_STATUS.pause) {
                    inJobTasks.push(task)
                }
                if (task.status == TASK_STATUS.coordination) {
                    coordinationTasks.push(task)
                }
                if (task.status == TASK_STATUS.done) {
                    doneTasks.push(task)
                }
            })

            this.view.newList.parse(newTasks)
            this.view.assignedList.parse(assignedTasks)
            this.view.inJobList.parse(inJobTasks)
            this.view.coordinationList.parse(coordinationTasks)
            this.view.doneList.parse(doneTasks)
        }
    }
}

export const TASK_STATUS = {
    new: 1,
    assigned: 2,
    inJob:3,
    pause: 4,
    coordination: 5,
    done: 6
}