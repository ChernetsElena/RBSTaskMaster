export default function TaskButtonView(){
    return {
        rows:[
            {},
            {cols:[
                {},
                {
                    view:"button", 
                    id:"tasksButtonToProjectsBtn", 
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
                    id:"tasksButtonNewTaskBtn", 
                    label:"Новая задача",
                    type: "icon",
                    icon: "wxi-plus-circle",
                    width: 170,
                    height: 35,
                    css: "tasks_button_new"
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