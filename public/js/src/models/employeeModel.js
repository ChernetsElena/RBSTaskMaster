import Model from '../../../js/helpers/model.js'

class EmployeeModel extends Model{
    constructor(){
        super()
    }

    createEmployee(dataWindow) {
        let day = dataWindow.birth.getDate() + 1
        dataWindow.birth.setDate(day)
        return this.post('/employee/create', dataWindow)
    }

    updateEmployee(dataWindow) {
        let day = dataWindow.birth.getDate() + 1
        dataWindow.birth.setDate(day)
        return this.post('/employee/update', dataWindow)
    }

    deleteEmployee(dataWindow) {
        return this.post('/employee/delete', dataWindow)
    }

    getEmployees() {
        return this.get('/employee/all')
    }

    getEmployeeById(id) {
        return this.get(`/employee/${id}`)
    }
}

const employeeModel = new EmployeeModel();
export default employeeModel