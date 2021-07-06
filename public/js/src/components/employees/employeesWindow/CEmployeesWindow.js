import EmployeesWindowView from './EmployeesWindowView.js'
import employeeModel from '../../../models/employeeModel.js'
import positionModel from '../../../models/positionModel.js'
import authModel from '../../../models/authModel.js'


export class EmployeesWindow {
    constructor(){
        this.view
        this.type
        this.onChange
        this.onDeleteAuthEmployee
        this.positions
        this.currentEmployeeId
    }

    init(onChange, onDeleteAuthEmployee) {
        this.onChange = onChange
        this.onDeleteAuthEmployee = onDeleteAuthEmployee
        this.positions = []
    }

    config() {
        return EmployeesWindowView()
    }

    attachEvents() {
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

        positionModel.getPositions().then((data) => {
            data.map((position) => {
                this.positions.push({id: `${position.name}`, value: `${position.name}`})
            })
            this.view.formfields.position.define('options', this.positions)
            this.view.formfields.position.refresh()
        })

        this.view.closeBtn.attachEvent("onItemClick", () => {
            this.clearForm()
            this.view.window.hide()
        })

        this.view.windowClearBtn.attachEvent("onItemClick", () => {
            this.view.formfields.name.setValue("")
            this.view.formfields.lastName.setValue("")
            this.view.formfields.middleName.setValue("")
            this.view.formfields.position.setValue("")
            this.view.formfields.email.setValue("")
            this.view.formfields.birth.setValue("")
        })

        this.view.windowConfirmBtn.attachEvent("onItemClick", () => {
            switch (this.type) {
                case EMPLOYEE_WINDOW_TYPE.new:
                    if (this.view.form.validate()) {
                        employeeModel.createEmployee(this.fetch()).then(() => {
                            this.onChange()
                            this.clearForm();
                            this.hide()
                        })
                        break;
                    }
                    else {
                        webix.message("Ваша форма не валидна")
                        break;
                    }
                    
                case EMPLOYEE_WINDOW_TYPE.update:
                    if (this.view.form.validate()) {
                        employeeModel.updateEmployee(this.fetch()).then(() => {
                            this.onChange()
                            this.clearForm();
                            this.hide()
                        })
                        break;
                    }
                    else {
                        webix.message("Ваша форма не валидна")
                        break;
                    }
                    
                case EMPLOYEE_WINDOW_TYPE.delete:
                    let deleteEmployee = this.fetch()
                    
                    authModel.getCurrentEmployee().then((employee) => {
                        if (deleteEmployee.ID == employee.ID) {
                            webix.confirm({text:"При удалении авторизированного сотрудника он будет перенаправлен на страницу авторизации. Вы уверены, что хотите удалить авторизованного сотрудника?"}).then((result) => {
                                if (result == true) {
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

    show(type) {
        switch (type) {
            case EMPLOYEE_WINDOW_TYPE.new:
                this.view.windowLabel.define("template", "Новый сотрудник")
                this.view.windowLabel.refresh()
                this.view.windowConfirmBtn.define("value", "Добавить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.show()
                this.view.windowClearBtn.refresh()
                this.enableForm()
                break;
            
            case EMPLOYEE_WINDOW_TYPE.update:
                this.view.windowLabel.define("template", "Редактирование")
                this.view.windowLabel.refresh()
                this.view.windowConfirmBtn.define("value", "Сохранить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
                this.enableForm()
                break;
            
            case EMPLOYEE_WINDOW_TYPE.delete:
                this.view.windowLabel.define("template", "Удаление")
                this.view.windowLabel.refresh()
                this.view.windowConfirmBtn.define("value", "Удалить")
                this.view.windowConfirmBtn.refresh()
                this.view.windowClearBtn.hide()
                this.view.windowClearBtn.refresh()
                this.disableForm()
                break;
            
            default:
                console.error('Неизвестный тип отображения окна для работы с сущностью задачи');
                return;
        }
        this.type = type
        this.view.window.show()
    }

    hide(){
        this.view.window.hide()
    }

    parse(values) {
        this.view.form.setValues(values)
    }

    fetch() {
        return this.view.form.getValues()
    }

    clearForm() {
        this.view.form.clear()
        this.view.form.clearValidation()
    }

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
}

export const EMPLOYEE_WINDOW_TYPE = {
    new: 'NEW',
    delete: 'DELETE',
    update: 'UPDATE'
}