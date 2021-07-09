
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
                            if ((xhr.response.error == "pq: update or delete on table \"t_employees\" violates foreign key constraint \"t_projects_fk_teamlead_fkey\" on table \"t_projects\"") || (xhr.response.error == "pq: UPDATE или DELETE в таблице \"t_employees\" нарушает ограничение внешнего ключа \"t_projects_fk_teamlead_fkey\" таблицы \"t_projects\"")){
                                webix.message('Данный сотрудник является тимлидом одного или нескольких проектов! Пожалуйста, переопределите тимлида данных проектов до удаления сотрудника.', 'error');
                            }
                            else {
                                webix.message('Не удалось совершить запрос', 'error');
                                console.error(`GET ${xhr.response.error}`);
                            }
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
}

// константы допустимых значений статуса ответа
const RESULT_STATE = {
    SUCCESS: 'succes',
    FAILED: 'failed',
}