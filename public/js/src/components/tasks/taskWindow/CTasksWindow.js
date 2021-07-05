import TaskWindowView from './TasksWindowView.js';
import taskModel from '../../../models/taskModel.js';
import employeeModel from '../../../models/employeeModel.js'
import statusModel from '../../../models/statusModel.js'
import {FormatTime} from '../../../../helpers/dateFormatter.js';

export class TaskWindow {
    constructor(){
        this.view
        this.type
        this.onChange
        this.projectId
        this.names
        this.task_status = []
        this.selectTask
    }

    init(onChange) {
        this.onChange = onChange
    }
    
    config(employees, status, urgently) {
        return TaskWindowView(employees, status, urgently)
    }

    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            window: $$('taskWindow'),
            windowLabel: $$('taskWindowLabel'),
            windowConfirmBtn: $$('taskWindowAddBtn'),
            windowClearBtn:$$('taskWindowClearBtn'),
            closeBtn: $$('taskWindowCloseButton'),
            deleteBtn: $$('taskWindowDeleteButton'),
            form: $$('formWindowTask'),
            formfields: {
                name: $$('formWindowTaskName'),
                projectID: $$('formWindowProjectID'),
                description: $$('formWindowTaskDescription'),
                performer: $$('formWindowTaskPerformer'),
                status: $$('formWindowTaskStage'),
                urgently: $$('formWindowTaskUrgently'),
                planTimeLabel: $$('formWindowTaskPlanTimeLabel'),
                planTime: $$('formWindowTaskPlanTime'),
                factTimeLabel: $$('formWindowTaskFactTimeLabel'),
                factTime: $$('formWindowTaskFactTime'),
            }
        }

        statusModel.getStatuses().then((data) => {
            data.map((status) => {
                this.task_status.push({id: `${status.ID}`, value: `${status.value}`})
            })
        })

        this.view.windowClearBtn.attachEvent("onItemClick", () => {
            this.view.formfields.name.setValue("")
            this.view.formfields.description.setValue("")
            this.view.formfields.performer.setValue("")
            this.view.formfields.urgently.setValue(1)
            this.view.formfields.status.setValue(1)
        })

        this.view.closeBtn.attachEvent("onItemClick", () => {
            this.clearForm()
            this.view.window.hide()
        })

        this.view.formfields.performer.attachEvent("onChange", () => {
            this.view.formfields.planTime.setValue(new Date(2000, 0, 1, 0, 0, 0, 0))
            this.view.formfields.factTime.setValue(new Date(2000, 0, 1, 0, 0, 0, 0))
            if (this.view.formfields.performer.getValue() == "") {
                this.view.formfields.status.setValue(1)
            }
            else {
                this.view.formfields.status.setValue(2)
            }
        })

        this.view.formfields.status.attachEvent("onChange", () => {
            let status = this.view.formfields.status.getValue()
            let performer = this.view.formfields.performer.getValue()
            
            let isEmptyPerformer = (performer == 0) || (performer == "")
            
            if ((status == "2") && isEmptyPerformer) {
                this.view.formfields.status.setValue(1)
            }
            if ((status == "1") && !isEmptyPerformer) {
                this.view.formfields.status.setValue(2)
            }
        })

        this.view.windowConfirmBtn.attachEvent("onItemClick", () => {
             switch (this.type) {
                case TASK_WINDOW_TYPE.create:
                    console.log(this.fetch())
                    if (this.view.form.validate()) {
                        taskModel.createTask(this.fetch()).then(() => {
                            this.clearForm()
                            this.onChange()
                            this.hide()
                        })
                        break;
                    }
                    else {
                        //webix.message("Ваша форма не валидна")
                        break;
                    }

                case TASK_WINDOW_TYPE.delete:
                    if (this.view.form.validate()) {
                        taskModel.deleteTask(this.fetch()).then(() => {
                            this.clearForm()
                            this.onChange()
                            this.hide()
                        })
                        break;
                    }
                    else {
                        //webix.message("Ваша форма не валидна")
                        break;
                    }

                default:
                    if (this.view.form.validate()) {
                        taskModel.updateTask(this.fetch()).then(() => {
                            this.clearForm()
                            this.onChange()
                            this.hide()
                        })
                        break;
                    }
                    else {
                        //webix.message("Ваша форма не валидна")
                        break;
                    }
            }
        })

        this.view.deleteBtn.attachEvent("onItemClick", () => {
            this.selectTask = this.view.form.getCleanValues()
            this.clearForm()
            this.view.window.hide()
            this.parse(this.selectTask)
            this.show(TASK_WINDOW_TYPE.delete, this.names)
        })
    }

    switch(type) {
        switch (this.view.window.isVisible()) {
            case true:
                this.hide()
                break;
            case false:
                this.show(type)
                break;
        }
    }

    show(type) {
        switch (type) {
            case TASK_WINDOW_TYPE.create:
                this.view.windowLabel.define("template", "Создание задачи")
                this.view.windowLabel.refresh()
                this.view.formfields.projectID.define("value", this.projectId)
                this.view.formfields.projectID.refresh()
                this.view.formfields.name.enable()
                this.view.formfields.name.refresh()
                this.view.formfields.description.define("readonly", false)
                webix.html.removeCss(this.view.formfields.description.getNode(), "disable_description");
                webix.html.addCss(this.view.formfields.description.getNode(), "enable_description");
                this.view.formfields.description.refresh()
                this.view.formfields.performer.enable()
                this.view.formfields.performer.refresh()
                this.view.formfields.status.define("options", [this.task_status[0], this.task_status[1]])
                this.view.formfields.status.disable()
                this.view.formfields.status.refresh()
                this.view.formfields.urgently.enable()
                this.view.formfields.urgently.refresh()
                this.view.formfields.planTimeLabel.hide()
                this.view.formfields.planTime.hide()
                this.view.formfields.factTimeLabel.hide()
                this.view.formfields.factTime.hide()
                this.view.windowConfirmBtn.show()
                this.view.windowConfirmBtn.define("value", "Создать")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.show()
                this.view.windowClearBtn.refresh()
                
                this.view.window.resize()
                break;

            case TASK_WINDOW_TYPE.new:
                this.view.windowLabel.define("template", "Новая задача")
                this.view.windowLabel.refresh()
                this.view.formfields.name.disable()
                this.view.formfields.name.refresh()
                this.view.formfields.description.define("readonly", true)
                webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
                webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
                this.view.formfields.description.refresh()
                this.view.formfields.performer.enable()
                this.view.formfields.performer.refresh()
                this.view.formfields.status.disable()
                this.view.formfields.status.refresh()
                this.view.formfields.urgently.disable()
                this.view.formfields.urgently.refresh()
                this.view.formfields.planTimeLabel.hide()
                this.view.formfields.planTime.hide()
                this.view.formfields.factTimeLabel.hide()
                this.view.formfields.factTime.hide()
                this.view.windowConfirmBtn.show()
                this.view.windowConfirmBtn.define("value", "Сохранить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
                
                this.view.window.resize()
                break;

            case TASK_WINDOW_TYPE.assigned:
                this.view.windowLabel.define("template", "Назначенная задача")
                this.view.windowLabel.refresh()
                this.view.formfields.name.disable()
                this.view.formfields.name.refresh()
                this.view.formfields.description.define("readonly", true)
                webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
                webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
                this.view.formfields.description.refresh()
                this.view.formfields.performer.disable()
                this.view.formfields.performer.refresh()
                this.view.formfields.status.enable()
                this.view.formfields.status.define("options", [this.task_status[1], this.task_status[2], this.task_status[4]])
                this.view.formfields.status.refresh()
                this.view.formfields.urgently.disable()
                this.view.formfields.urgently.refresh()
                this.view.formfields.planTimeLabel.show()
                this.view.formfields.planTime.show()
                this.view.formfields.planTime.enable()
                this.view.formfields.factTimeLabel.show()
                this.view.formfields.factTime.show()
                this.view.formfields.factTime.disable()
                this.view.windowConfirmBtn.show()
                this.view.windowConfirmBtn.define("value", "Сохранить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
              
                this.view.window.resize()
                break;

            case TASK_WINDOW_TYPE.inJob:
                this.view.windowLabel.define("template", "Задача в работе")
                this.view.windowLabel.refresh()
                this.view.formfields.name.disable()
                this.view.formfields.name.refresh()
                this.view.formfields.description.define("readonly", true)
                webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
                webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
                this.view.formfields.description.refresh()
                this.view.formfields.performer.disable()
                this.view.formfields.performer.refresh()
                this.view.formfields.status.enable()
                this.view.formfields.status.define("options", [this.task_status[2], this.task_status[3], this.task_status[4], this.task_status[5]])
                this.view.formfields.status.refresh()
                this.view.formfields.urgently.disable()
                this.view.formfields.urgently.refresh()
                this.view.formfields.planTimeLabel.show()
                this.view.formfields.planTime.show()
                this.view.formfields.planTime.disable()
                this.view.formfields.factTimeLabel.show()
                this.view.formfields.factTime.show()
                this.view.formfields.factTime.enable()
                this.view.windowConfirmBtn.show()
                this.view.windowConfirmBtn.define("value", "Сохранить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
               
                this.view.window.resize()
                break;

            case TASK_WINDOW_TYPE.pause:
                this.view.windowLabel.define("template", "Пауза")
                this.view.windowLabel.refresh()
                this.view.formfields.name.disable()
                this.view.formfields.name.refresh()
                this.view.formfields.description.define("readonly", true)
                webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
                webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
                this.view.formfields.description.refresh()
                this.view.formfields.performer.disable()
                this.view.formfields.performer.refresh()
                this.view.formfields.status.enable()
                this.view.formfields.status.define("options", [this.task_status[2], this.task_status[3], this.task_status[4], this.task_status[5]])
                this.view.formfields.status.refresh()
                this.view.formfields.urgently.disable()
                this.view.formfields.urgently.refresh()
                this.view.formfields.planTimeLabel.show()
                this.view.formfields.planTime.show()
                this.view.formfields.planTime.disable()
                this.view.formfields.factTimeLabel.show()
                this.view.formfields.factTime.show()
                this.view.formfields.factTime.disable()
                this.view.windowConfirmBtn.show()
                this.view.windowConfirmBtn.define("value", "Сохранить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
                
                this.view.window.resize()
                break;

            case TASK_WINDOW_TYPE.coordination:
                this.view.windowLabel.define("template", "Задача на согласовании")
                this.view.windowLabel.refresh()
                this.view.formfields.name.enable()
                this.view.formfields.name.refresh()
                this.view.formfields.description.define("readonly", false)
                webix.html.removeCss(this.view.formfields.description.getNode(), "disable_description");
                webix.html.addCss(this.view.formfields.description.getNode(), "enable_description");
                this.view.formfields.description.refresh()
                this.view.formfields.performer.enable()
                this.view.formfields.performer.refresh()
                this.view.formfields.status.enable()
                this.view.formfields.status.define("options", [this.task_status[0], this.task_status[1], this.task_status[4]])
                this.view.formfields.status.refresh()
                this.view.formfields.urgently.enable()
                this.view.formfields.urgently.refresh()
                this.view.formfields.planTimeLabel.hide()
                this.view.formfields.planTime.hide()
                this.view.formfields.factTimeLabel.hide()
                this.view.formfields.factTime.hide()
                this.view.windowConfirmBtn.show()
                this.view.windowConfirmBtn.define("value", "Сохранить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
                
                this.view.window.resize()
                break;

            case TASK_WINDOW_TYPE.done:
                this.view.windowLabel.define("template", "Задача выполнена")
                this.view.windowLabel.refresh()
                this.view.formfields.name.disable()
                this.view.formfields.name.refresh()
                this.view.formfields.description.define("readonly", true)
                webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
                webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
                this.view.formfields.description.refresh()
                this.view.formfields.performer.disable()
                this.view.formfields.performer.refresh()
                this.view.formfields.status.disable()
                this.view.formfields.status.define("options", this.task_status)
                this.view.formfields.status.refresh()
                this.view.formfields.urgently.disable()
                this.view.formfields.urgently.refresh()
                this.view.formfields.planTimeLabel.show()
                this.view.formfields.planTime.show()
                this.view.formfields.planTime.disable()
                this.view.formfields.factTimeLabel.show()
                this.view.formfields.factTime.show()
                this.view.formfields.factTime.disable()
                this.view.windowConfirmBtn.hide()
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
                
                this.view.window.resize()
                break;
            
            case TASK_WINDOW_TYPE.delete:
                this.view.windowLabel.define("template", "Удаление задачи")
                this.view.windowLabel.refresh()
                this.view.formfields.name.disable()
                this.view.formfields.name.refresh()
                this.view.formfields.description.define("readonly", true)
                this.view.formfields.description.refresh()
                this.view.formfields.performer.disable()
                this.view.formfields.performer.refresh()
                this.view.formfields.status.disable()
                this.view.formfields.status.refresh()
                this.view.formfields.urgently.disable()
                this.view.formfields.urgently.refresh()
                this.view.formfields.planTimeLabel.show()
                this.view.formfields.planTime.show()
                this.view.formfields.planTime.disable()
                this.view.formfields.factTimeLabel.show()
                this.view.formfields.factTime.show()
                this.view.formfields.factTime.disable()
                this.view.windowConfirmBtn.show()
                this.view.windowConfirmBtn.define("value", "Удалить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
                this.view.window.resize()
                break;
            
            default:
                console.error('Неизвестный тип отображения окна для работы с сущностью задачи');
                return;
        }
        this.type = type
        this.view.window.show()
    }

    refresh() {
        this.names = []
        employeeModel.getEmployees().then((data) => {
            data.map((employee) => {
                this.names.push({id: `${employee.ID}`, value: `${employee.last_name} ${employee.name}`})
            })
            this.view.formfields.performer.define("options", this.names)
            this.view.formfields.performer.refresh()
        })
    }

    hide() {
        this.view.window.hide()
    }

    parse(values) {
        this.view.form.setValues(values)
    }

    fetch() {
        return this.view.form.getValues()
    }

    setId(projectId) {
        this.projectId = projectId
    }

    clearForm() {
        this.view.form.clear()
        this.view.form.clearValidation()
        this.view.formfields.urgently.setValue(1)
    }
}

export const TASK_WINDOW_TYPE = {
    create: 'CREATE',
    new: 'NEW',
    assigned: 'ASSIGNED',
    inJob: 'INJOB',
    pause: 'PAUSE',
    coordination: 'COORDINATION',
    done: 'DONE',
    delete: 'DELETE'
}