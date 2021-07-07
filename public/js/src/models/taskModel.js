import Model from '../../../js/helpers/model.js'
import {FormatTime} from '../../helpers/dateFormatter.js';

class TaskModel extends Model {
    constructor(){
        super()
    }

    createTask(dataWindow) {
        dataWindow.projectID = Number(dataWindow.projectID)
        dataWindow.performerID = Number(dataWindow.performerID)
        dataWindow.status = Number(dataWindow.status)
        dataWindow.urgently = Number(dataWindow.urgently)
       
        dataWindow.plan_time = FormatTime(dataWindow.plan_time)
        dataWindow.fact_time = FormatTime(dataWindow.fact_time)

        return this.post('/task/create', dataWindow)
    }

    getTasksByProjectId(id) {
        return this.get(`/task/project/${id}`)
    }

    updateTask(dataWindow) {
        
        dataWindow.projectID = Number(dataWindow.projectID)
        dataWindow.performerID = Number(dataWindow.performerID)
        dataWindow.status = Number(dataWindow.status)
        dataWindow.urgently = Number(dataWindow.urgently)

        dataWindow.plan_time = FormatTime(dataWindow.plan_time)
        dataWindow.fact_time = FormatTime(dataWindow.fact_time)
        return this.post('/task/update', dataWindow)
    }

    deleteTask(dataWindow) {
        dataWindow.projectID = Number(dataWindow.projectID)
        dataWindow.performerID = Number(dataWindow.performerID)
        dataWindow.status = Number(dataWindow.status)
        dataWindow.urgently = Number(dataWindow.urgently)

        dataWindow.plan_time = FormatTime(dataWindow.plan_time)
        dataWindow.fact_time = FormatTime(dataWindow.fact_time)

        return this.post('/task/delete', dataWindow)
    }

    getTaskById(id) {
        return this.get(`/task/${id}`)
    }
}

const taskModel = new TaskModel();
export default taskModel