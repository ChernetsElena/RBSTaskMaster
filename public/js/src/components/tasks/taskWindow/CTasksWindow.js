import TaskWindowView from './TasksWindowView.js';
import taskModel from '../../../models/taskModel.js';
import employeeModel from '../../../models/employeeModel.js'
import statusModel from '../../../models/statusModel.js'
import { TASK_STATUS } from '../CTasks.js';

// компонент окна для работы с сущностью задачи
export class TaskWindow {
    constructor() {
        this.view                   // объект для быстрого доступа к представлениям
        this.type                   // тип текущего отображения окна
        this.onChange               // callback функция при CUD операциях над задачей
        this.projectId              // id текущего проекта
        this.names                  // исполнители
        this.task_status = []       // статусы задач
        this.selectTask             // текущая задача
        this.typeBeforeDelete       // тип окна до отображения окна с типом delete
    }

    // метод инициализации компонента
    init(onChange) {
        this.onChange = onChange
    }

    // метод получения webix конфигурации компонента
    config(employees, status, urgently) {
        return TaskWindowView(employees, status, urgently)
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            window: $$('taskWindow'),
            windowLabel: $$('taskWindowLabel'),
            windowConfirmBtn: $$('taskWindowAddBtn'),
            windowClearBtn: $$('taskWindowClearBtn'),
            closeBtn: $$('taskWindowCloseButton'),
            deleteBtn: $$('taskWindowDeleteButton'),
            showBtn: $$('taskWindowBackButton'),
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

        // подгрузка статусов
        statusModel.getStatuses().then((data) => {
            data.map((status) => {
                this.task_status.push({ id: `${status.ID}`, value: `${status.value}` })
            })
        })

        // обрабтка очистки окна
        this.view.windowClearBtn.attachEvent("onItemClick", () => {
            this.clearForm()
        })

        // обрабтка закрытия окна
        this.view.closeBtn.attachEvent("onItemClick", () => {
            this.clearForm()
            this.view.window.hide()
        })

        // обрабтка cобытия нажатия кнопки "просмотр"
        this.view.showBtn.attachEvent("onItemClick", () => {
            this.selectTask = this.view.form.getCleanValues()
            this.clearForm()
            this.view.window.hide()
            this.parse(this.selectTask)
            this.show(this.typeBeforeDelete, this.names)
        })

        // обрабтка cобытия нажатия кнопки "удаление"
        this.view.deleteBtn.attachEvent("onItemClick", () => {
            this.typeBeforeDelete = this.type
            this.selectTask = this.view.form.getCleanValues()
            this.clearForm()
            this.view.window.hide()
            this.parse(this.selectTask)
            this.show(TASK_WINDOW_TYPE.delete, this.names)
        })

        // обрабтка cобытия изменения исполнителя
        this.view.formfields.performer.attachEvent("onChange", () => {
            const perfomerID = this.view.formfields.performer.getValue()
            // если не выбран исполнитель, то статус принимает значение "новая"
            if (perfomerID == "" || perfomerID == -1) {
                this.view.formfields.status.setValue(TASK_STATUS.new)
            }
            // если исполнитель выбран, то статус принимает значение "назначена"
            else {
                this.view.formfields.status.setValue(TASK_STATUS.assigned)
            }
        })

        // обрабтка cобытия изменения статуса
        this.view.formfields.status.attachEvent("onChange", () => {
            let status = this.view.formfields.status.getValue()
            let performerID = this.view.formfields.performer.getValue()
            let isEmptyPerformer = (performerID == 0) || (performerID == "") || (performerID == -1)
            
            // если не выбран исполнитель и пользователь выбирает статус "назначена", то статус принимает значение "новая"
            if ((status == TASK_STATUS.assigned) && isEmptyPerformer) {
                this.view.formfields.status.setValue(TASK_STATUS.new)
            }
            // если выбран исполнитель и пользователь выбирает статус "новая", то исполнитель принимает значение пустой строки
            if ((status == TASK_STATUS.new) && !isEmptyPerformer) {
                this.view.formfields.performer.setValue(-1)
            }
        })

        // обработка события 'принять'
        this.view.windowConfirmBtn.attachEvent("onItemClick", () => {
            // при удалении не требуется валидировать данные формы
            // валидация введенных данных по обязательным полям
            if (this.type !== TASK_WINDOW_TYPE.delete && !this.view.form.validate()) {
                return;
            }
            switch (this.type) {
                case TASK_WINDOW_TYPE.create:
                    taskModel.createTask(this.fetch()).then(() => {
                        this.clearForm()
                        this.onChange()
                        this.hide()
                    })
                    break;
                   
                case TASK_WINDOW_TYPE.delete:
                    taskModel.deleteTask(this.fetch()).then(() => {
                        this.clearForm()
                        this.onChange()
                        this.hide()
                    })
                    break;
                   
                default:
                    taskModel.updateTask(this.fetch()).then(() => {
                        this.clearForm()
                        this.onChange()
                        this.hide()
                    })
                    break;
            }
        })
    }

     // метод вызова модального окна
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

    // метод отображения окна
    show(type) {
        switch (type) {
            case TASK_WINDOW_TYPE.create:
                this.createTask()
                break;

            case TASK_WINDOW_TYPE.new:
                this.newTask()
                break;

            case TASK_WINDOW_TYPE.assigned:
                this.assignedTask()
                break;

            case TASK_WINDOW_TYPE.inJob:
                this.inJobTask()
                break;

            case TASK_WINDOW_TYPE.pause:
                this.pauseTask()
                break;

            case TASK_WINDOW_TYPE.coordination:
                this.coordinationTask()
                break;

            case TASK_WINDOW_TYPE.done:
                this.doneTask()
                break;

            case TASK_WINDOW_TYPE.delete:
                this.deleteTask()
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

            this.names.push({ id: -1, value: '' })
            data.map((employee) => {
                this.names.push({ id: `${employee.ID}`, value: `${employee.last_name} ${employee.name}` })
            })


            this.view.formfields.performer.define("options", this.names)
            this.view.formfields.performer.refresh()
        })
    }

    // метод сокрытия окна
    hide() {
        this.view.window.hide()
    }

    // метод размещения сущности в форме окна
    parse(values) {
        this.view.form.setValues(values)
    }

    // метод получения сущности из формы окна
    fetch() {
        // установка параметра, обозначающего изменение данных в форме
        this.view.form.setDirty(true)

        let data = this.view.form.getValues()
        if (data.performerID === "-1") {
            data.performerID =
             ''
        }
        // если текущий тип окна согласование и исполнитель задачи не изменен,
        // планируемое и фактическое время выполнения задачи не изменяются.
        // если исполнитель изменился, планируемое и фактическое время выполнения
        // устанавливаются в 0
        if (this.type == TASK_WINDOW_TYPE.coordination) {
            let clean = this.view.form.getCleanValues().performerID
            let dirty = this.view.form.getDirtyValues()
            if (dirty.hasOwnProperty('performerID')) {
                if (clean != dirty.perfomerID) {
                    data.plan_time = new Date(2000, 0, 1, 0, 0, 0, 0)
                    data.fact_time = new Date(2000, 0, 1, 0, 0, 0, 0)
                }
            }

        }
        return data
    }

    // установка id текущего проекта
    setId(projectId) {
        this.projectId = projectId
    }

    // функция очистки формы
    clearForm() {
        this.view.form.clear()
        this.view.form.clearValidation()
        this.view.formfields.performer.setValue(-1)
        this.view.formfields.urgently.setValue(1)
        this.view.formfields.status.setValue(1)
        this.view.formfields.planTime.setValue("00:00")
        this.view.formfields.factTime.setValue("00:00")
    }

    // функция изменения окна для создания задачи
    createTask() {
        webix.html.removeCss(this.view.formfields.description.getNode(), "disable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "enable_description");
        this.view.windowLabel.define("template", "Создание задачи")
        this.view.windowLabel.refresh()
        this.view.formfields.projectID.define("value", this.projectId)
        this.view.formfields.projectID.refresh()
        this.view.formfields.name.enable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", false)
        this.view.formfields.description.refresh()
        this.view.formfields.performer.enable()
        this.view.formfields.performer.refresh()
        // установка возможных статусов для данного типа окна
        this.view.formfields.status.define("options", [this.task_status[TASK_STATUS.new-1], this.task_status[TASK_STATUS.assigned-1]])
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
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.deleteBtn.hide()
        this.view.deleteBtn.refresh()
        this.view.windowClearBtn.show()
        this.view.windowClearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для просмотра новой задачи
    newTask() {
        webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
        this.view.windowLabel.define("template", "Новая задача")
        this.view.windowLabel.refresh()
        this.view.formfields.name.disable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", true)
        this.view.formfields.description.refresh()
        this.view.formfields.performer.enable()
        this.view.formfields.performer.refresh()
        // установка возможных статусов для данного типа окна
        this.view.formfields.status.define("options", [this.task_status[TASK_STATUS.new-1], this.task_status[TASK_STATUS.assigned-1]])
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
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.deleteBtn.show()
        this.view.deleteBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для просмотра назначенной задачи
    assignedTask(){
        webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
        this.view.windowLabel.define("template", "Назначенная задача")
        this.view.windowLabel.refresh()
        this.view.formfields.name.disable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", true)
        this.view.formfields.description.refresh()
        this.view.formfields.performer.disable()
        this.view.formfields.performer.refresh()
        this.view.formfields.status.enable()
        // установка возможных статусов для данного типа окна
        this.view.formfields.status.define("options", [this.task_status[TASK_STATUS.assigned-1], this.task_status[TASK_STATUS.inJob-1], this.task_status[TASK_STATUS.coordination-1]])
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
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.deleteBtn.show()
        this.view.deleteBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для просмотра задачи в работе
    inJobTask(){
        webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
        this.view.windowLabel.define("template", "Задача в работе")
        this.view.windowLabel.refresh()
        this.view.formfields.name.disable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", true)
        this.view.formfields.description.refresh()
        this.view.formfields.performer.disable()
        this.view.formfields.performer.refresh()
        this.view.formfields.status.enable()
        // установка возможных статусов для данного типа окна
        this.view.formfields.status.define("options", [this.task_status[TASK_STATUS.inJob-1], this.task_status[TASK_STATUS.pause-1], this.task_status[TASK_STATUS.coordination-1], this.task_status[TASK_STATUS.done-1]])
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
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.deleteBtn.show()
        this.view.deleteBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для просмотра задачи в паузе
    pauseTask() {
        webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
        this.view.windowLabel.define("template", "Пауза")
        this.view.windowLabel.refresh()
        this.view.formfields.name.disable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", true)
        this.view.formfields.description.refresh()
        this.view.formfields.performer.disable()
        this.view.formfields.performer.refresh()
        this.view.formfields.status.enable()
        // установка возможных статусов для данного типа окна
        this.view.formfields.status.define("options",  [this.task_status[TASK_STATUS.inJob-1], this.task_status[TASK_STATUS.pause-1], this.task_status[TASK_STATUS.coordination-1], this.task_status[TASK_STATUS.done-1]])
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
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.deleteBtn.show()
        this.view.deleteBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для просмотра задачи на согласовании
    coordinationTask(){
        webix.html.removeCss(this.view.formfields.description.getNode(), "disable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "enable_description");
        this.view.windowLabel.define("template", "Задача на согласовании")
        this.view.windowLabel.refresh()
        this.view.formfields.name.enable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", false)
        this.view.formfields.description.refresh()
        this.view.formfields.performer.enable()
        this.view.formfields.performer.refresh()
        this.view.formfields.status.enable()
        // установка возможных статусов для данного типа окна
        this.view.formfields.status.define("options", [this.task_status[TASK_STATUS.new-1], this.task_status[TASK_STATUS.assigned-1], this.task_status[TASK_STATUS.coordination-1]])
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
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.deleteBtn.show()
        this.view.deleteBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.view.window.resize()
    }


    // функция изменения окна для просмотра выполненной задачи
    doneTask() {
        webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
        this.view.windowLabel.define("template", "Задача выполнена")
        this.view.windowLabel.refresh()
        this.view.formfields.name.disable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", true)
        this.view.formfields.description.refresh()
        this.view.formfields.performer.disable()
        this.view.formfields.performer.refresh()
        this.view.formfields.status.disable()
        // установка возможных статусов для данного типа окна
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
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.deleteBtn.show()
        this.view.deleteBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для удаления задачи
    deleteTask() {
        webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
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
        this.view.showBtn.show()
        this.view.showBtn.refresh()
        this.view.deleteBtn.hide()
        this.view.deleteBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.view.window.resize()
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