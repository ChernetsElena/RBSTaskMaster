import {dataTasks} from '../src/data/dataTasks.js'
import {dataEmployees} from '../src/data/dataEmployees.js'
import {dataProjects} from '../src/data/dataProjects.js'
import {dataPositions} from '../src/data/dataPositions.js'
import {Task} from '../src/models/entities/task.js'
import {Employee} from '../src/models/entities/employee.js'
import {Project} from '../src/models/entities/project.js'

export default class Model {
    //метод для совершения get запроса
    get(url) {
        return new Promise(function (resolve, reject) {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'json'
            xhr.onload = () => {
                // проверка статуса HTTP запроса
                if (xhr.status != 200) {
                    webix.message(xhr.status + ': ' + xhr.statusText, 'error');
                    reject()
                } else {
                    if (!xhr.response) {
                        return
                    }
                    // валидация статуса ответа сервера
                    if (!xhr.response.status) {
                        webix.message('Не удалось совершить запрос', 'error');
                        console.error(`GET xhr.response.status is ${xhr.response.status}`);
                        reject()
                    }

                    // проверка статуса ответа сервера
                    switch (xhr.response.status) {
                        case RESULT_STATE.SUCCESS: // положительный результат запроса
                            resolve(xhr.response.data);
                            return;
                        case RESULT_STATE.FAILED: // отрицательный результат запроса
                            webix.message('Не удалось совершить запрос', 'error');
                            console.error(`GET ${xhr.response.error}`);
                            reject();
                            return;
                        default: // ошибка при получении результата запроса
                            webix.message('Не удалось совершить запрос', 'error');
                            console.error(`GET Статус ответа сервера не соответствует ожидаемым значениям, xhr.response.status is ${xhr.response.status}`);
                            reject();
                            return;
                    }
                }
            }
            xhr.send()
        })
    }

    // метод для совершения post запроса
    post(url, params) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.responseType = 'json'
            xhr.onload = () => {
                // проверка статуса HTTP запроса
                if (xhr.status !== 200) {
                    webix.message(xhr.status + ': ' + xhr.statusText, 'error');
                    reject()
                } else {
                    if (!xhr.response) {
                        return
                    }
                    // валидация статуса ответа сервера
                    if (!xhr.response.status) {
                        webix.message('Не удалось совершить запрос', 'error');
                        console.error(`GET xhr.response.status is ${xhr.response.status}`);
                        reject()
                    }

                    // проверка статуса ответа сервера
                    switch (xhr.response.status) {
                        case RESULT_STATE.SUCCESS: // положительный результат запроса
                            resolve(xhr.response.data);
                            return;
                        case RESULT_STATE.FAILED: // отрицательный результат запроса
                            webix.message('Не удалось совершить запрос', 'error');
                            console.error(`GET ${xhr.response.error}`);
                            reject();
                            return;
                        default: // ошибка при получении результата запроса
                            webix.message('Не удалось совершить запрос', 'error');
                            console.error(`GET Статус ответа сервера не соответствует ожидаемым значениям, xhr.response.status is ${xhr.response.status}`);
                            reject();
                            return;
                    }
                }
            }
            xhr.send(JSON.stringify(params))
        })
    }

    // // метод для совершения post запроса
    // post(url, params) {
    //     return new Promise(function (resolve, reject) {
    //         let performer
    //         let teamlead
    //         switch (url) {
                
    //             case URL_TYPE.createTask:
    //                 performer = dataEmployees.find(item => item.id == params.performerID)
    //                 params.performer_name = performer.name
    //                 params.performer_last_name = performer.last_name
    //                 dataTasks.push(new Task(
    //                     Number(dataTasks[dataTasks.length-1].id) + 1,
    //                     params.projectID,
    //                     params.status,
    //                     params.name, 
    //                     params.description, 
    //                     params.performerID, 
    //                     params.performer_name, 
    //                     params.performer_last_name, 
    //                     params.urgently, 
    //                     params.plan_time,
    //                     params.fact_time))
    //                 resolve();
    //                 break; 

    //             case URL_TYPE.updateTask:
    //                 performer = dataEmployees.find(item => item.id == params.performerID)
    //                 params.performer_name = performer.name
    //                 params.performer_last_name = performer.last_name
    //                 let updateTask = dataTasks.find(item => item.id == params.id)
    //                 let indexOfUpdateTask = dataTasks.indexOf(updateTask)
    //                 dataTasks.splice(indexOfUpdateTask, 1, params)
    //                 resolve(dataTasks);
    //                 break;

    //             case URL_TYPE.deleteTask:
    //                 let deleteTask = dataTasks.find(item => item.id == params.id)
    //                 let indexOfDeleteTask = dataTasks.indexOf(deleteTask)
    //                 dataTasks.splice(indexOfDeleteTask, 1)
    //                 resolve(dataTasks);
    //                 break;

    //             case URL_TYPE.getTasksByProjectId:
    //                 let tasksOfProject = []
    //                 dataTasks.map((task) => {
    //                     if (task.projectID == params) {
    //                         tasksOfProject.push(task)
    //                     }
    //                 })
    //                 resolve(tasksOfProject);
    //                 break;

    //             case URL_TYPE.getTaskById:
    //                 let task = dataTasks.find(item => item.id == params)
    //                 resolve(task);
    //                 break;

                

    //             case URL_TYPE.createEmployee:
    //                 dataEmployees.push(new Employee(
    //                     Number(dataEmployees[dataEmployees.length-1].id) + 1, 
    //                     params.position, 
    //                     params.name, 
    //                     params.last_name, 
    //                     params.middle_name, 
    //                     params.email, 
    //                     params.birth)
    //                 )
    //                 resolve(dataEmployees)
    //                 break;

    //             case URL_TYPE.getEmployees:
    //                 resolve(dataEmployees)
    //                 break;

    //             case URL_TYPE.updateEmployee:
    //                 let updateEmployee = dataEmployees.find(item => item.id == params.id)
    //                 let indexOfUpdateEmployee = dataEmployees.indexOf(updateEmployee)
    //                 dataEmployees.splice(indexOfUpdateEmployee, 1, params)
    //                 resolve(dataEmployees)
    //                 break;
                
    //             case URL_TYPE.deleteEmployee:
    //                 let deleteEmployee = dataEmployees.find(item => item.id == params.id)
    //                 let indexOfDeleteEmployee = dataEmployees.indexOf(deleteEmployee)
    //                 dataEmployees.splice(indexOfDeleteEmployee, 1)
    //                 resolve(dataEmployees)
    //                 break;

    //             case URL_TYPE.getEmployeeById:
    //                 console.log(params)
    //                 let employee = dataEmployees.find(item => item.id == params)
    //                 resolve(employee)
    //                 break;

    //             case URL_TYPE.createProject:
    //                 teamlead = dataEmployees.find(item => item.id == params.teamleadID)
    //                 params.teamlead_name = teamlead.name
    //                 params.teamlead_last_name = teamlead.last_name
    //                 dataProjects.push(new Project(
    //                     Number(dataProjects[dataProjects.length-1].id) + 1,
    //                     params.name, 
    //                     params.description, 
    //                     params.teamleadID, 
    //                     params.teamlead_name, 
    //                     params.teamlead_last_name, 
    //                     params.color_one, 
    //                     params.color_two)
    //                 )
    //                 resolve(dataProjects)
    //                 break;

    //             case URL_TYPE.updateProject:
    //                 console.log(params)
    //                 teamlead = dataEmployees.find(item => item.id == params.teamleadID)
    //                 console.log(params.teamleadID)
    //                 params.teamlead_name = teamlead.name
    //                 params.teamlead_last_name = teamlead.last_name
    //                 console.log(params)
    //                 let updateProject = dataProjects.find(item => item.id == params.id)
    //                 let indexOfUpdateProject = dataProjects.indexOf(updateProject)
    //                 dataProjects.splice(indexOfUpdateProject, 1, params)
    //                 resolve(dataProjects)
    //                 break;

    //             case URL_TYPE.deleteProject:
    //                 let deleteProject = dataProjects.find(item => item.id == params.id)
    //                 let indexOfDeleteProject = dataProjects.indexOf(deleteProject)
    //                 dataProjects.splice(indexOfDeleteProject, 1)
    //                 resolve(dataProjects)
    //                 break;

    //             case URL_TYPE.getProjects:
    //                 resolve(dataProjects)
    //                 break;

    //             case URL_TYPE.getProjectById:
    //                 let project = dataProjects.find(item => item.id == params)
    //                 resolve(project);
    //                 break;

    //             case URL_TYPE.getPositions:
    //                 resolve(dataPositions)
                    
    //             default: reject()
    //         }
    //     })
    // }
}

        


 const URL_TYPE = {
    createTask: '/task/create',
    updateTask: '/task/update',
    deleteTask: '/task/delete',
    getTasksByProjectId: '/task/project',
    getTaskById: '/task/id',

    createProject: '/project/create',
    updateProject: '/project/update',
    deleteProject: '/project/delete',
    getProjects: '/project/all',
    getProjectById: '/project/id',

    createEmployee: '/employee/create',
    updateEmployee: '/employee/update',
    deleteEmployee: '/employee/delete', 
    getEmployees: '/employee/all',
    getEmployeeById: '/employee/id',

    getPositions: '/position/all',

    getStatuses: '/status/all',

    getUrgently: '/urgently/all'

}

// константы допустимых значений статуса ответа
const RESULT_STATE = {
    SUCCESS: 'succes',
    FAILED: 'failed',
}