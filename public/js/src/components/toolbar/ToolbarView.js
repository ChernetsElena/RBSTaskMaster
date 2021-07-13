// возвращает webix конфигурации тулбара
export default function ToolbarView(){
    return {
        view: 'toolbar',
        id: 'toolbar',
        css: 'toolbar',
        height: 60,
        cols: [
            {width: 50},
            // кнопка с фамилией именем сотрудника
            {
                view: "button", 
                id: "toolbarUserButton",
                type: "icon", 
                icon: "wxi-user",
                label: "загрузка...",
                height: 50,
                autowidth:true,
                disabled:true
            },
            {width: 10},
            {
                view: "button", 
                id: "toolbarEmployeesButton",
                label: "Сотрудники",
                width: 150
            },
            {
                view: 'label',
                id: 'toolbarLabel',
                label: "TaskMaster",
                
            },
            // кнопка выхода
            {
                view: 'button',
                id: 'toolbarLogoutButton',
                css: 'webix_transparent',
                label: 'Выход',
                width: 150,
                height: 50
            },
            {width:50}
        ],
    }
}