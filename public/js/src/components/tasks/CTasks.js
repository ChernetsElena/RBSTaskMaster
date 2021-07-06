import TasksView from './TasksView.js';
import { TaskWindow, TASK_WINDOW_TYPE } from './taskWindow/CTasksWindow.js';
import taskModel from '../../models/taskModel.js';
import employeeModel from '../../models/employeeModel.js';
import statusModel from '../../models/statusModel.js';
import urgentlyModel from '../../models/urgentlyModel.js';
import {StringToDate} from '../../../helpers/dateFormatter.js';


export class Tasks {
    constructor(){
        this.view
        this.window = new TaskWindow()
        this.tasksButton
        this.names
        this.projectId
        this.color_one
        this.color_two
        this.task_status
        this.task_urgently
    }

    init(tasksButton, showProjectsViewCB){
        this.window = new TaskWindow()

        this.tasksButton = tasksButton

        this.tasksButton.init(this.window, showProjectsViewCB)

        this.window.init(() => { 
            taskModel.getTasksByProjectId(this.projectId).then((data) => {
                this.refreshView(data, this.projectId, this.color_one, this.color_two) 
            })
        })

        this.names = []
        this.task_status = []
        this.task_urgently = []

    }

    config() {
        webix.ui(this.window.config(this.names, this.task_status, this.task_urgently))
        return TasksView(this.task_status)
    }

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

        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                this.names.push({id: `${employee.id}`, value: `${employee.last_name} ${employee.name}`})
            })
        })

        statusModel.getStatuses().then((data) => {
            data.map((status) => {
                this.task_status.push({id: `${status.ID}`, value: `${status.value}`})
            })
        })

        urgentlyModel.getUrgently().then((data) => {
            data.map((urgently) => {
                this.task_urgently.push({id: `${urgently.ID}`, value: `${urgently.value}`})
            })
        })

        this.window.attachEvents()

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

        this.view.newList.attachEvent("onSelectChange", (id) => {
            let select = this.view.newList.getItem(id)
            taskModel.getTaskById(select.ID).then((selectTask) => {
                selectTask.plan_time = StringToDate(selectTask.plan_time)
                selectTask.fact_time = StringToDate(selectTask.fact_time)
                this.window.parse(selectTask)
                this.showWindow(TASK_WINDOW_TYPE.new);
                this.view.newList.unselectAll();
            })
        })

        this.view.assignedList.attachEvent("onSelectChange", (id) => {
            let select = this.view.assignedList.getItem(id)
            taskModel.getTaskById(select.ID).then((selectTask) => {
                selectTask.plan_time = StringToDate(selectTask.plan_time)
                selectTask.fact_time = StringToDate(selectTask.fact_time)
                this.window.parse(selectTask)
                this.showWindow(TASK_WINDOW_TYPE.assigned)
                this.view.assignedList.unselectAll();
            })
        })
        
        this.view.inJobList.attachEvent("onSelectChange", (id) => {
            let select = this.view.inJobList.getItem(id)
            taskModel.getTaskById(select.ID).then((selectTask) => {
                selectTask.plan_time = StringToDate(selectTask.plan_time)
                selectTask.fact_time = StringToDate(selectTask.fact_time)
                this.window.parse(selectTask)
                this.showWindow(TASK_WINDOW_TYPE.inJob);
                this.view.inJobList.unselectAll();
            })
        })

        this.view.coordinationList.attachEvent("onSelectChange", (id) => {
            let select = this.view.coordinationList.getItem(id)
            taskModel.getTaskById(select.ID).then((selectTask) => {
                selectTask.plan_time = StringToDate(selectTask.plan_time)
                selectTask.fact_time = StringToDate(selectTask.fact_time)
                this.window.parse(selectTask)
                this.showWindow(TASK_WINDOW_TYPE.coordination)
                this.view.coordinationList.unselectAll();
            })
        })

        this.view.doneList.attachEvent("onSelectChange", (id) => {
            let select = this.view.doneList.getItem(id)
            taskModel.getTaskById(select.ID).then((selectTask) => {
                selectTask.plan_time = StringToDate(selectTask.plan_time)
                selectTask.fact_time = StringToDate(selectTask.fact_time)
                this.window.parse(selectTask)
                this.showWindow(TASK_WINDOW_TYPE.done);
                this.view.doneList.unselectAll();
            })
        })
    }

    showWindow(type) {
        this.window.refresh()
        this.window.show(type)
    }

    refreshView(tasksData, projectId, color_one, color_two) {
        
        this.projectId = projectId
        this.color_one = color_one
        this.color_two = color_two
        
        this.window.setId(projectId)
        this.view.newList.clearAll()
        this.view.assignedList.clearAll()
        this.view.inJobList.clearAll()
        this.view.coordinationList.clearAll()
        this.view.doneList.clearAll()
        
        document.querySelector('.bg').style.background = `linear-gradient(-45deg, ${this.color_one}, ${this.color_two})`;
        
        if (tasksData != null) {
            let newTasks = []
            let assignedTasks = []
            let inJobTasks = []
            let coordinationTasks = []
            let doneTasks = []

            tasksData.map((task) => {
                if (task.status == 1) {
                    newTasks.push(task)
                } 
                if (task.status == 2) {
                    assignedTasks.push(task)
                }
                if (task.status == 3) {
                    inJobTasks.push(task)
                }
                if (task.status == 4) {
                    inJobTasks.push(task)
                }
                if (task.status == 5) {
                    coordinationTasks.push(task)
                }
                if (task.status == 6) {
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