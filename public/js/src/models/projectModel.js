import Model from '../../../js/helpers/model.js'

// ProjectModel объект для работы(CRUD) с данными
class ProjectModel extends Model{
    constructor(){
        super()
    }

    //создание проекта
    createProject(dataWindow) {
       dataWindow.teamleadID = Number(dataWindow.teamleadID)
       return this.post('/project/create', dataWindow)
    }

    //обновление проекта
    updateProject(dataWindow) {
        dataWindow.teamleadID = Number(dataWindow.teamleadID)
        return this.post('/project/update', dataWindow)
    }

    //удаление проекта
    deleteProject(dataWindow) {
        dataWindow.teamleadID = Number(dataWindow.teamleadID)
        return this.post('/project/delete', dataWindow)
    }

    //получение всех проектов
    getProjects() {
        return this.get('/project/all')
    }

    //получение проекта по id
    getProjectById(id) {
        return this.get(`/project/${id}`)
    }
}

const projectModel = new ProjectModel();
export default projectModel