// возвращает webix конфигурации кнопки для работы с сущностью проекта
export default function ProjectsButtonView(){
    return {
        rows:[
            {},
            {
                view:"button", 
                type: "icon",
                icon: "wxi-plus-circle",
                id:"projectsAddButton", 
                label:"Новый проект",
                width: 170,
                height: 35,
                align : 'center',
            },
            {}
        ],
        css:{"background": "linear-gradient(45deg, #A3B1FF, #7388FF)"},
        height: 50
    }
}