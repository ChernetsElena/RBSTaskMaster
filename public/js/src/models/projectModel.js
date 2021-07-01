import Model from '../../../js/helpers/model.js'

class ProjectModel extends Model{
    constructor(){
        super()
    }

    createProject(dataWindow) {
       dataWindow.teamleadID = Number(dataWindow.teamleadID)
       return this.post('/project/create', dataWindow)
    }

    updateProject(dataWindow) {
        dataWindow.teamleadID = Number(dataWindow.teamleadID)
        return this.post('/project/update', dataWindow)
    }

    deleteProject(dataWindow) {
        dataWindow.teamleadID = Number(dataWindow.teamleadID)
        return this.post('/project/delete', dataWindow)
    }

    getProjects() {
        return this.get('/project/all')
    }

    getProjectById(id) {
        return this.get(`/project/${id}`)
    }
}

const projectModel = new ProjectModel();
export default projectModel