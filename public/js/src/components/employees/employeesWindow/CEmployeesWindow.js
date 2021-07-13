import EmployeesWindowView from './EmployeesWindowView.js'
import employeeModel from '../../../models/employeeModel.js'
import positionModel from '../../../models/positionModel.js'
import authModel from '../../../models/authModel.js'

// компонент окна для работы с сущностью сотрудника
export class EmployeesWindow {
    constructor(){
        this.view                           // объект для быстрого доступа к представлениям
        this.type                           // тип текущего отображения окна
        this.onChange                       // callback функция при CUD операциях над сотрудником
        this.onDeleteAuthEmployee           // callback функция при удалении авторизованного сотрудника
        this.positions                      // должности
        this.currentEmployeeId              // id текущего пользователя
    }

    // метод инициализации компонента
    init(onChange, onDeleteAuthEmployee) {
        this.onChange = onChange
        this.onDeleteAuthEmployee = onDeleteAuthEmployee
        this.positions = []
    }

    // метод получения webix конфигурации компонента
    config() {
        return EmployeesWindowView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            window: $$('windowEmployee'),
            windowLabel: $$('employeeWindowLabel'),
            windowConfirmBtn: $$('employeeWindowConfirmBtn'),
            windowClearBtn: $$('employeeWindowClearBtn'),
            closeBtn: $$('employeeWindowCloseButton'),
            form: $$('formWindowEmployee'),
            formfields: {
                lastName: $$('employeeLastName'),
                name: $$('employeeFirstName'),
                middleName: $$('employeeMiddleName'),
                position: $$('employeePosition'),
                email: $$('employeeEmail'),
                birth: $$('employeeBirth'),         
            }
        }

        // подгрузка должностей
        positionModel.getPositions().then((data) => {
            data.map((position) => {
                this.positions.push({id: `${position.name}`, value: `${position.name}`})
            })
            this.view.formfields.position.define('options', this.positions)
            this.view.formfields.position.refresh()
        })

        // обрабтка закрытия окна
        this.view.closeBtn.attachEvent("onItemClick", () => {
            this.clearForm()
            this.view.window.hide()
        })

        // обрабтка очистки окна
        this.view.windowClearBtn.attachEvent("onItemClick", () => {
            this.clearForm()
        })

        // обработка события 'принять'
        this.view.windowConfirmBtn.attachEvent("onItemClick", () => {
            // при удалении не требуется валидировать данные формы
            // валидация введенных данных по обязательным полям
            if (this.type !== EMPLOYEE_WINDOW_TYPE.delete && !this.view.form.validate()) {
                webix.message('Ваша форма не валидна', 'error')
                return;
            }
            switch (this.type) {
                case EMPLOYEE_WINDOW_TYPE.new:
                    employeeModel.createEmployee(this.fetch()).then(() => {
                        this.onChange()
                        this.clearForm();
                        this.hide()
                    })
                    break;
                    
                case EMPLOYEE_WINDOW_TYPE.update:
                    employeeModel.updateEmployee(this.fetch()).then(() => {
                        this.onChange()
                        this.clearForm();
                        this.hide()
                    })
                    break;      
                    
                case EMPLOYEE_WINDOW_TYPE.delete:
                    // получение сотрудника
                    let deleteEmployee = this.fetch()
                     // проверка авторизованности
                    authModel.getCurrentEmployee().then((employee) => {
                        if (deleteEmployee.ID == employee.ID) {
                            webix.confirm({text:"При удалении авторизованного сотрудника он будет перенаправлен на страницу авторизации. Вы уверены, что хотите удалить авторизованного сотрудника?"}).then((result) => {
                                if (result == true) {
                                    // удаление сотрудника
                                    employeeModel.deleteEmployee(deleteEmployee).then(() => {
                                        this.onChange()
                                        this.clearForm();
                                        this.hide()
                                        this.onDeleteAuthEmployee()
                                    })
                                }
                            })
                        }
                        else {
                            // удаление сотрудника
                            employeeModel.deleteEmployee(deleteEmployee).then(() => {
                                this.onChange()
                                this.clearForm();
                                this.hide()
                            })
                        }
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
            case EMPLOYEE_WINDOW_TYPE.new:
                this.newEmployee()
                break;
            
            case EMPLOYEE_WINDOW_TYPE.update:
                this.updateEmployee()
                break;
            
            case EMPLOYEE_WINDOW_TYPE.delete:
                this.deleteEmployee()
                break;
            
            default:
                console.error('Неизвестный тип отображения окна для работы с сущностью задачи');
                return;
        }
        this.type = type
        this.view.window.show()
    }

    // метод сокрытия окна
    hide(){
        this.view.window.hide()
    }

    // метод размещения сущности в форме окна
    parse(values) {
        this.view.form.setValues(values)
    }

    // метод получения сущности из формы окна
    fetch() {
        return this.view.form.getValues()
    }

    // функция очистки формы
    clearForm() {
        this.view.form.clear()
        this.view.form.clearValidation()
        this.view.formfields.name.setValue("")
        this.view.formfields.lastName.setValue("")
        this.view.formfields.middleName.setValue("")
        this.view.formfields.position.setValue("")
        this.view.formfields.email.setValue("")
        this.view.formfields.birth.setValue("")
    }

    // функция приведения окна к виду, позволяющему редактирование
    enableForm() {
        this.view.formfields.name.enable()
        this.view.formfields.name.refresh()
        this.view.formfields.lastName.enable()
        this.view.formfields.lastName.refresh()
        this.view.formfields.middleName.enable()
        this.view.formfields.middleName.refresh()
        this.view.formfields.position.enable()
        this.view.formfields.email.enable()
        this.view.formfields.email.refresh()
        this.view.formfields.birth.enable()
        this.view.formfields.birth.refresh()
    }

    // функция приведения окна к виду, запрещающему редактирование
    disableForm() {
        this.view.formfields.name.disable()
        this.view.formfields.name.refresh()
        this.view.formfields.lastName.disable()
        this.view.formfields.lastName.refresh()
        this.view.formfields.middleName.disable()
        this.view.formfields.middleName.refresh()
        this.view.formfields.position.disable()
        this.view.formfields.email.disable()
        this.view.formfields.email.refresh()
        this.view.formfields.birth.disable()
        this.view.formfields.birth.refresh()
    }

    // функция изменения окна для создания сотрудника
    newEmployee(){
        this.view.windowLabel.define("template", "Новый сотрудник")
        this.view.windowLabel.refresh()
        this.view.windowConfirmBtn.define("value", "Добавить")
        this.view.windowConfirmBtn.refresh()
        this.view.windowClearBtn.show()
        this.view.windowClearBtn.refresh()
        this.enableForm()
    }

    // функция изменения окна для редактирования сотрудника
    updateEmployee(){
        this.view.windowLabel.define("template", "Редактирование")
        this.view.windowLabel.refresh()
        this.view.windowConfirmBtn.define("value", "Сохранить")
        this.view.windowConfirmBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.enableForm()
    }

     // функция изменения окна для удаления сотрудника
    deleteEmployee(){
        this.view.windowLabel.define("template", "Удаление")
        this.view.windowLabel.refresh()
        this.view.windowConfirmBtn.define("value", "Удалить")
        this.view.windowConfirmBtn.refresh()
        this.view.windowClearBtn.hide()
        this.view.windowClearBtn.refresh()
        this.disableForm()
    }
}

export const EMPLOYEE_WINDOW_TYPE = {
    new: 'NEW',
    delete: 'DELETE',
    update: 'UPDATE'
}