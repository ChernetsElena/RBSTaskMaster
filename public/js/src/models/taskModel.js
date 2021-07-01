import Model from '../../../js/helpers/model.js'

class TaskModel extends Model {
    constructor(){
        super()
    }

    createTask(dataWindow) {
        dataWindow.projectID = Number(dataWindow.projectID)
        dataWindow.performerID = Number(dataWindow.performerID)
        dataWindow.status = Number(dataWindow.status)
        dataWindow.urgently = Number(dataWindow.urgently)
        console.log(dataWindow.plan_time)

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

        return this.post('/task/update', dataWindow)
    }

    deleteTask(dataWindow) {
        dataWindow.projectID = Number(dataWindow.projectID)
        dataWindow.performerID = Number(dataWindow.performerID)
        dataWindow.status = Number(dataWindow.status)
        dataWindow.urgently = Number(dataWindow.urgently)
        return this.post('/task/delete', dataWindow)
    }

    getTaskById(id) {
        return this.get(`/task/${id}`)
    }
}

const taskModel = new TaskModel();
export default taskModel