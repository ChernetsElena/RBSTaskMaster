export default function ProjectsWindowView(){
    let headText = 'Новый проект'
    
    return {
        view:"window",
        id:"projectWindow",
        position: "center",
        modal: true,
        move: true,
        head: {cols: [
                {
                    view: 'template',
                    id: 'projectWindowLabel',
                    template: headText,
                    borderless: true,
                    type:"header",
                },
                {},
                {
                    view: "button",
                    id: "projectWindowDeleteButton",
                    type: "icon",
                    icon: "wxi-trash",
                    tooltip: "Удалить",
                    width: 50,
    
                },
                {
                    view: "button",
                    id: "projectWindowShowButton",
                    type: "icon",
                    icon: "wxi-eye",
                    tooltip: "Просмотреть",
                    width: 50,
                },
                {
                    view: "button",
                    id: "projectWindowUpdateButton",
                    type: "icon",
                    icon: "wxi-pencil",
                    tooltip: "Редактировать",
                    width: 50,
    
                },
                {
                    view: "button",
                    id: "projectWindowCloseButton",
                    type: "icon",
                    icon: "wxi-close",
                    tooltip: "Закрыть",
                    width: 50,
    
                }
            ]},
        body:{
            view:"form", 
            id:"formWindowProject",
            width: 500,
            elements:[
                { rows:[
                        {
                            view:"text", 
                            label:"Название проекта",
                            name: "name",
                            id:"formWindowProjectName", 
                            width: 400,
                            labelWidth: 150,
                            align : 'center',
                            attributes: {required: true}
                        },
                        {cols: [
                            {width: 34},
                            { 
                                view:"colorpicker", 
                                id: "formWindowProjectColorOne",
                                label:"Цвета проекта", 
                                labelWidth: 150,
                                width: 275,
                                name:"color_one",
                                value:"#ffdb5c" 
                            },
                            { 
                                view:"colorpicker", 
                                id: "formWindowProjectColorTwo",
                                width: 125,
                                name:"color_two",
                                value:"#ffacac" 
                            }
                        ]},
                    {
                        view:"textarea", 
                        label:"Описание",
                        name: "description",
                        labelWidth: 150,
                        id:"formWindowProjectDescription", 
                        width: 400,
                        height: 200,
                        align : 'center',
                        css: 'disable_description'
                    },
                    {
                        view:"combo", 
                        id:"formWindowProjecTeamlead", 
                        label:"Teamlead",
                        name: "teamleadID", 
                        width: 400,
                        labelWidth: 150,
                        align : 'center',
                        options: []
                    },
                    {
                        view:"text", 
                        id:"formWindowProjecTeamleadName", 
                        label:"Имя", 
                        name: "teamlead_name",
                        width: 400,
                        labelWidth: 100,
                        align : 'center',
                        hidden: true
                    },
                    {
                        view:"text", 
                        id:"formWindowProjecTeamleadLastName", 
                        label:"Фамилия", 
                        name: "teamlead_last_name",
                        width: 400,
                        labelWidth: 100,
                        align : 'center',
                        hidden: true
                    },
                    {cols: [
                        {},
                        {
                            view:"button", 
                            id:"addProjectBtn", 
                            value:"Создать",
                            width: 150,
                            align : 'center',
                            top: 20,
                            css: "webix_primary"
                        }, 
                        {
                            view:"button", 
                            id:"projectWindowClearBtn", 
                            value:"Очистить",
                            width: 150,
                            align : 'center',
                            top: 20,
                            css: "webix_secondary",
                            hidden: "true"
                        }, 
                        {},
                    ]} 
                ],
                
            },    
        ],
        rules:{
            "name": function(value){
                if (value.length >= 50) {
                    webix.message("Длина названия не должна превышать 50 символов", "error")
                    return false
                }
                return webix.rules.isNotEmpty(value)
            },
            "description": webix.rules.isNotEmpty,
            "teamleadID": webix.rules.isNotEmpty
        },
        css:{"border-color":"orange"},
    }
    }
}