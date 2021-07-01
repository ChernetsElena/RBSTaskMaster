import EmployeesWindowView from './EmployeesWindowView.js'
import employeeModel from '../../../models/employeeModel.js'
import positionModel from '../../../models/positionModel.js'


export class EmployeesWindow {
    constructor(){
        this.view
        this.type
        this.onChang
        this.positions
    }

    init(onChange) {
        this.onChange = onChange

        this.positions = []
    }

    config() {
        return EmployeesWindowView()
    }

    attachEvents() {
        this.view = {
            window: $$('windowEmployee'),
            windowLabel: $$('employeeWindowLabel'),
            windowConfirmBtn: $$('addEmployeeBtn'),
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
                    if (this.view.form.validate()) {
                        employeeModel.deleteEmployee(this.fetch()).then(() => {
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
                this.enableForm()
                break;
            
            case EMPLOYEE_WINDOW_TYPE.update:
                this.view.windowLabel.define("template", "Редактирование")
                this.view.windowLabel.refresh()
                this.view.windowConfirmBtn.define("value", "Сохранить")
                this.view.windowConfirmBtn.refresh()
                this.enableForm()
                break;
            
            case EMPLOYEE_WINDOW_TYPE.delete:
                this.view.windowLabel.define("template", "Удаление")
                this.view.windowLabel.refresh()
                this.view.windowConfirmBtn.define("value", "Удалить")
                this.view.windowConfirmBtn.refresh()
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
        // this.view.formfields.name.define("readonly", false)
        // this.view.formfields.name.refresh()
        // this.view.formfields.lastName.define("readonly", false)
        // this.view.formfields.lastName.refresh()
        // this.view.formfields.middleName.define("readonly", false)
        // this.view.formfields.middleName.refresh()
        // this.view.formfields.position.enable()
        // this.view.formfields.email.define("readonly", false)
        // this.view.formfields.email.refresh()
        // this.view.formfields.birth.define("readonly", false)
        // this.view.formfields.birth.refresh()
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
        // this.view.formfields.name.define("readonly", true)
        // this.view.formfields.name.refresh()
        // this.view.formfields.lastName.define("readonly", true)
        // this.view.formfields.lastName.refresh()
        // this.view.formfields.middleName.define("readonly", true)
        // this.view.formfields.middleName.refresh()
        // this.view.formfields.position.disable()
        // this.view.formfields.email.define("readonly", true)
        // this.view.formfields.email.refresh()
        // this.view.formfields.birth.define("readonly", true)
        // this.view.formfields.birth.refresh()
    }
}

export const EMPLOYEE_WINDOW_TYPE = {
    new: 'NEW',
    delete: 'DELETE',
    update: 'UPDATE'
}