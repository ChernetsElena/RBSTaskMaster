import ProjectsWindowView from './ProjectsWindowView.js';
import projectModel from '../../../models/projectModel.js'

// компонент окна для работы с сущностью проекта
export class ProjectsWindow {
    constructor(){
        this.view                       // объект для быстрого доступа к представлениям
        this.type                       // тип текущего отображения окна
        this.onChange                   // callback функция при CUD операциях над проектом
        this.names                      // тимлиды
        this.selectProject              // тукущий выбранный проект
    }

    // метод инициализации компонента
    init(onChange) {
        this.onChange = onChange
    }

    // метод получения webix конфигурации компонента
    config() {
        return ProjectsWindowView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            window: $$('projectWindow'),
            windowLabel: $$('projectWindowLabel'),
            windowConfirmBtn: $$('addProjectBtn'),
            clearBtn: $$('projectWindowClearBtn'),
            closeBtn: $$('projectWindowCloseButton'),
            updateBtn: $$('projectWindowUpdateButton'),
            deleteBtn: $$('projectWindowDeleteButton'),
            showBtn: $$('projectWindowShowButton'),
            form: $$('formWindowProject'),
            formfields: {
                name: $$('formWindowProjectName'),
                colorOne: $$('formWindowProjectColorOne'),
                colorTwo: $$('formWindowProjectColorTwo'),
                description: $$('formWindowProjectDescription'),
                teamlead: $$('formWindowProjecTeamlead'),
            }
        }

        // обрабтка закрытия окна
        this.view.closeBtn.attachEvent("onItemClick", () => {
            this.clearForm();
            this.view.window.hide();
        });

        // обрабтка очистки окна
        this.view.clearBtn.attachEvent("onItemClick", () => {
            this.clearForm();
        });

        // обрабтка события нажатия на кнопку "просмотр"
        this.view.showBtn.attachEvent("onItemClick", () => {
            this.selectProject = this.view.form.getCleanValues()
            this.clearForm()
            this.view.window.hide()
            this.parse(this.selectProject)
            this.show(PROJECT_WINDOW_TYPE.show, this.names)
        })

        // обрабтка события нажатия на кнопку "редактировать"
        this.view.updateBtn.attachEvent("onItemClick", () => {
            this.view.window.hide()
            this.show(PROJECT_WINDOW_TYPE.update, this.names)
        })

        // обрабтка события нажатия на кнопку "удаление"
        this.view.deleteBtn.attachEvent("onItemClick", () => {
            this.selectProject = this.view.form.getCleanValues()
            this.clearForm()
            this.view.window.hide()
            this.parse(this.selectProject)
            this.show(PROJECT_WINDOW_TYPE.delete, this.names)
        })

        // обработка события 'принять'
        this.view.windowConfirmBtn.attachEvent("onItemClick", () => {
            // при удалении не требуется валидировать данные формы
            // валидация введенных данных по обязательным полям
            if (this.type !== PROJECT_WINDOW_TYPE.delete && !this.view.form.validate()) {
                webix.message("Ваша форма не валидна", 'error')
                return;
            }
            switch (this.type) {
                case PROJECT_WINDOW_TYPE.new:
                    projectModel.createProject(this.fetch()).then(() => {
                        this.onChange()
                        this.clearForm();
                        this.hide()
                    })
                    break;
                    
                case PROJECT_WINDOW_TYPE.update:
                    projectModel.updateProject(this.fetch()).then(() => {
                        this.onChange()
                        this.clearForm();
                        this.hide()
                    })
                    break;
                    
                case PROJECT_WINDOW_TYPE.delete:
                    projectModel.deleteProject(this.fetch()).then(() => {
                        this.onChange()
                        this.clearForm();
                        this.hide()
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
    show(type, employees) {
        this.names = employees
        switch (type) {
            case PROJECT_WINDOW_TYPE.new:
                this.newProject(employees)
                break;

            case PROJECT_WINDOW_TYPE.update:
                this.updateProject(employees)
                break;

            case PROJECT_WINDOW_TYPE.show:
                this.showProject(employees)
                break;

            case PROJECT_WINDOW_TYPE.delete:
                this.deleteProject(employees)
                break;
            
            default:
                console.error('Неизвестный тип отображения окна для работы с сущностью проекта');
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

    // метод очистки формы окна
    clearForm() {
        this.view.form.clear()
        this.view.form.clearValidation()
        this.view.formfields.colorOne.setValue("#ffdb5c")
        this.view.formfields.colorTwo.setValue("#ffacac")
    }

    // функция изменения окна для создания проекта
    newProject(employees) {
        webix.html.removeCss(this.view.formfields.description.getNode(), "disable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "enable_description");
        this.view.windowLabel.define("template", "Новый проект")
        this.view.windowLabel.refresh()
        this.view.formfields.name.enable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", false)
        this.view.formfields.description.refresh()
        this.view.formfields.colorOne.enable()
        this.view.formfields.colorTwo.enable()
        this.view.formfields.teamlead.define("options", employees)
        this.view.formfields.teamlead.enable()
        this.view.formfields.teamlead.refresh()
        this.view.windowConfirmBtn.show()
        this.view.windowConfirmBtn.define("value", "Создать")
        this.view.windowConfirmBtn.refresh()
        this.view.updateBtn.hide()
        this.view.updateBtn.refresh()
        this.view.deleteBtn.hide()
        this.view.deleteBtn.refresh()
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.clearBtn.show()
        this.view.clearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для редактирования проекта
    updateProject(employees){
        webix.html.removeCss(this.view.formfields.description.getNode(), "disable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "enable_description");
        this.view.windowLabel.define("template", "Изменить проект")
        this.view.windowLabel.refresh()
        this.view.formfields.name.enable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", false)
        this.view.formfields.description.refresh()
        this.view.formfields.colorOne.enable()
        this.view.formfields.colorTwo.enable()
        this.view.formfields.teamlead.enable()
        this.view.formfields.teamlead.define("options", employees)
        this.view.formfields.teamlead.refresh()
        this.view.windowConfirmBtn.define("value", "Сохранить")
        this.view.windowConfirmBtn.refresh()
        this.view.updateBtn.hide()
        this.view.updateBtn.refresh()
        this.view.deleteBtn.show()
        this.view.deleteBtn.refresh()
        this.view.showBtn.show()
        this.view.showBtn.refresh()
        this.view.windowConfirmBtn.show()
        this.view.windowConfirmBtn.refresh()
        this.view.clearBtn.hide()
        this.view.clearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для просмотра проекта
    showProject(employees){
        webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
        this.view.windowLabel.define("template", "Просмотр проекта")
        this.view.windowLabel.refresh()
        this.view.formfields.name.disable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", true)
        this.view.formfields.description.refresh()
        this.view.formfields.colorOne.disable()
        this.view.formfields.colorTwo.disable()
        this.view.formfields.teamlead.disable()
        this.view.formfields.teamlead.define("options", employees)
        this.view.formfields.teamlead.refresh()
        this.view.updateBtn.show()
        this.view.updateBtn.refresh()
        this.view.deleteBtn.show()
        this.view.deleteBtn.refresh()
        this.view.showBtn.hide()
        this.view.showBtn.refresh()
        this.view.windowConfirmBtn.hide()
        this.view.clearBtn.hide()
        this.view.clearBtn.refresh()
        this.view.window.resize()
    }

    // функция изменения окна для удаления проекта
    deleteProject(employees){
        webix.html.removeCss(this.view.formfields.description.getNode(), "enable_description");
        webix.html.addCss(this.view.formfields.description.getNode(), "disable_description");
        this.view.windowLabel.define("template", "Удаление проекта")
        this.view.windowLabel.refresh()
        this.view.formfields.name.disable()
        this.view.formfields.name.refresh()
        this.view.formfields.description.define("readonly", true)
        this.view.formfields.description.refresh()
        this.view.formfields.colorOne.disable()
        this.view.formfields.colorTwo.disable()
        this.view.formfields.teamlead.disable()
        this.view.formfields.teamlead.define("options", employees)
        this.view.formfields.teamlead.refresh()
        this.view.windowConfirmBtn.define("value", "Удалить")
        this.view.windowConfirmBtn.refresh()
        this.view.updateBtn.show()
        this.view.updateBtn.refresh()
        this.view.deleteBtn.hide()
        this.view.deleteBtn.refresh()
        this.view.showBtn.show()
        this.view.showBtn.refresh()
        this.view.windowConfirmBtn.show()
        this.view.clearBtn.hide()
        this.view.clearBtn.refresh()
        this.view.window.resize()
    }
}

export const PROJECT_WINDOW_TYPE = {
    new: 'NEW',
    show: 'SHOW',
    update: 'UPDATE',
    delete: 'DELETE'
}