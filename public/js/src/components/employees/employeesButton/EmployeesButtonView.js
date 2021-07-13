
// возвращает webix конфигурации кнопки для работы с сущностью сотрудника
export default function EmployeesButtonView(){
    return {
        rows:[
            {},
            {cols:[
                {},
                {
                    view:"button", 
                    id:"employeeToProjectsBtn", 
                    label:"К проектам",
                    type: "icon",
                    icon: "wxi-angle-left",
                    width: 150,
                    height: 35,
                    css: "tasks_button_back"
                },
                {width: 280},
                {
                    view:"button", 
                    type: "icon",
                    id:"employeeButtonAddBtn", 
                    label:"Добавить сотрудника",
                    icon: "wxi-plus-circle",
                    width: 170,
                    height: 35,
                    css: "employee_button_new"
                },
                {},
                {},
                {} 
            ],
            },
            {}
        ],
        css:{"background": "linear-gradient(45deg, #A3B1FF, #7388FF)"},
        height: 50
    }
}