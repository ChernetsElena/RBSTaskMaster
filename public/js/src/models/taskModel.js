import Model from '../../../js/helpers/model.js'
import {FormatTime} from '../../helpers/dateFormatter.js';

// TaskModel объект для работы(CRUD) с данными
class TaskModel extends Model {
    constructor(){
        super()
    }

    //создание задачи
    createTask(dataWindow) {
        //приведение параметров к числу
        dataWindow.projectID = Number(dataWindow.projectID)
        dataWindow.performerID = Number(dataWindow.performerID)
        dataWindow.status = Number(dataWindow.status)
        dataWindow.urgently = Number(dataWindow.urgently)

        //приведение даты к строке
        dataWindow.plan_time = FormatTime(dataWindow.plan_time)
        dataWindow.fact_time = FormatTime(dataWindow.fact_time)

        return this.post('/task/create', dataWindow)
    }

    //получение задач по id прроекта
    getTasksByProjectId(id) {
        return this.get(`/task/project/${id}`)
    }

    //обновление задачи
    updateTask(dataWindow) {
        //приведение параметров к числу
        dataWindow.projectID = Number(dataWindow.projectID)
        dataWindow.performerID = Number(dataWindow.performerID)
        dataWindow.status = Number(dataWindow.status)
        dataWindow.urgently = Number(dataWindow.urgently)

        //приведение даты к строке
        dataWindow.plan_time = FormatTime(dataWindow.plan_time)
        dataWindow.fact_time = FormatTime(dataWindow.fact_time)

        return this.post('/task/update', dataWindow)
    }

    //удаление задачи
    deleteTask(dataWindow) {
        //приведение параметров к числу
        dataWindow.projectID = Number(dataWindow.projectID)
        dataWindow.performerID = Number(dataWindow.performerID)
        dataWindow.status = Number(dataWindow.status)
        dataWindow.urgently = Number(dataWindow.urgently)

        //приведение даты к строке
        dataWindow.plan_time = FormatTime(dataWindow.plan_time)
        dataWindow.fact_time = FormatTime(dataWindow.fact_time)

        return this.post('/task/delete', dataWindow)
    }

    //получение задачи по id
    getTaskById(id) {
        return this.get(`/task/${id}`)
    }
}

const taskModel = new TaskModel();
export default taskModel