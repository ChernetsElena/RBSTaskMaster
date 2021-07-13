import Model from '../../../js/helpers/model.js'

// EmployeeModel объект для работы(CRUD) с данными
class EmployeeModel extends Model{
    constructor(){
        super()
    }

    //создание сотрудника
    createEmployee(dataWindow) {
        let day = dataWindow.birth.getDate() + 1
        dataWindow.birth.setDate(day)
        return this.post('/employee/create', dataWindow)
    }

    //обновление данных сотрудника
    updateEmployee(dataWindow) {
        let day = dataWindow.birth.getDate() + 1
        dataWindow.birth.setDate(day)
        return this.post('/employee/update', dataWindow)
    }

    //удаление сотрудника
    deleteEmployee(dataWindow) {
        return this.post('/employee/delete', dataWindow)
    }

    //получение всех сотрудников
    getEmployees() {
        return this.get('/employee/all')
    }
    //получение сотрудника по id
    getEmployeeById(id) {
        return this.get(`/employee/${id}`)
    }
}

const employeeModel = new EmployeeModel();
export default employeeModel