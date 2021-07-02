
export default function EmployeesWindowView(positions){
    let headText = 'Добавление сотрудника'

    return {
        view:"window",
        id:"windowEmployee",
        position: "center",
        modal: true,
        head: {cols: [
            {
                view: 'template',
                id: 'employeeWindowLabel',
                css: 'webix_template',
                template: headText,
                borderless: true,
                type:"header",
                width: 300,
            },
            {width: 130},
            {
                view: "button",
                id: "employeeWindowCloseButton",
                type: "icon",
                icon: "wxi-close",
                width: 40,
            }
        ]},
        body:{
            view:"form", 
            id:"formWindowEmployee",
            width: 500,
            elements:[
                { rows:[
                    {
                        view:"text", 
                        label:"Фамилия",
                        name: "last_name",
                        id:"employeeLastName", 
                        width: 400,
                        labelWidth: 150,
                        align : 'center',
                        attributes: {required: true},
                        //invalidMessage:"Пожалуйста, введите фамилию" 
                    },
                    {
                        view:"text", 
                        label:"Имя",
                        name: "name",
                        id:"employeeFirstName", 
                        width: 400,
                        labelWidth: 150,
                        align : 'center',
                        attributes: {required: true},
                        //invalidMessage:"Пожалуйста, введите имя" 
                    },
                    {
                        view:"text", 
                        label:"Отчество",
                        name: "middle_name",
                        id:"employeeMiddleName", 
                        width: 400,
                        labelWidth: 150,
                        align : 'center',
                        attributes: {required: true}
                    },
                    {
                        view:"select", 
                        label:"Должность",
                        name: "position",
                        id:"employeePosition", 
                        width: 400,
                        labelWidth: 150,
                        align : 'center',
                        options: positions,
                    },
                    {
                        view:"text", 
                        label:"E-mail",
                        name: "email",
                        id:"employeeEmail", 
                        width: 400,
                        labelWidth: 150,
                        align : 'center',
                        attributes: {required: true},
                        //invalidMessage:"Некорректный адрес почты" 
                    },
                    {
                        view:"datepicker", 
                        label:"Дата рождения",
                        name: "birth",
                        id:"employeeBirth", 
                        width: 400,
                        labelWidth: 150,
                        align : 'center',
                        attributes: {required: true},
                        //invalidMessage:"Некорректная дата" 
                    },
                    {cols: [
                        {},
                        {
                            view:"button", 
                            id:"employeeWindowConfirmBtn", 
                            value:"Готово",
                            width: 150,
                            align : 'center',
                            top: 20,
                            css: "webix_primary"
                        },
                        {
                            view:"button", 
                            id:"employeeWindowClearBtn", 
                            value:"Очистить",
                            width: 150,
                            align : 'center',
                            top: 20,
                            css: "webix_secondary"
                        },
                        {} 
                    ]} 
                ],
                
            },    
        ],
        css:{"border-color":"orange"},
        rules:{
            "last_name":webix.rules.isNotEmpty,
            "name":webix.rules.isNotEmpty,
            "email":webix.rules.isEmail,
            "birth":webix.rules.isNotEmpty,
            "birth": function(value){ 
                let ageDate= new Date(new Date() - value)
                let treashold = new Date(1984, 0, 1)
                return ageDate > treashold
            },
        }
    }
    }
}