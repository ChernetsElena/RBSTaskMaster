import {FormatTime} from '../../../../helpers/dateFormatter.js';

export default function TasksWindowView(employees, task_status, task_urgently){
    let headText = 'Новая задача' 

    return {
        view:"window",
        id:"taskWindow",
        position: "center",
        modal: true,
        move: true,
        head: {cols: [
            {
                view: 'template',
                id: 'taskWindowLabel',
                template: headText,
                borderless: true,
                type:"header",
            },
            {},
            {
                view: "button",
                id: "taskWindowBackButton",
                type: "icon",
                icon: "wxi-eye",
                width: 50,
            },
            {
                view: "button",
                id: "taskWindowDeleteButton",
                type: "icon",
                icon: "wxi-trash",
                width: 50,

            },
            {
                view: "button",
                id: "taskWindowCloseButton",
                type: "icon",
                icon: "wxi-close",
                width: 50,
            }
        ]},
        body:{
            view:"form", 
            id:"formWindowTask",
            width: 1000,
            elements:[
                { rows:[
                    {
                        view:"text", 
                        label:"Задача",
                        id:"formWindowTaskName", 
                        name: "name",
                        width: 400,
                        labelWidth: 100,
                        align : 'center',
                        attributes: {required: true},
                    }, 
                    {
                        view:"text", 
                        label:"ID проекта",
                        id:"formWindowProjectID", 
                        name: "projectID",
                        width: 400,
                        labelWidth: 100,
                        align : 'center',
                        hidden: true
                    },     
                    {
                        view:"textarea", 
                        label:"Описание",
                        name: "description",
                        id:"formWindowTaskDescription", 
                        width: 400,
                        height: 150,
                        labelWidth: 100,
                        align : 'center',
                        css: 'disable_description'
                    },
                    {
                        view:"combo", 
                        id:"formWindowTaskPerformer", 
                        label:"Исполнитель", 
                        name: "performerID",
                        width: 400,
                        labelWidth: 100,
                        align : 'center',
                        options: employees
                    },
                    {
                        view:"text", 
                        id:"formWindowTaskPerformerName", 
                        label:"Имя", 
                        name: "performer_name",
                        width: 400,
                        labelWidth: 100,
                        align : 'center',
                        hidden: true
                    },
                    {
                        view:"text", 
                        id:"formWindowTaskPerformerLastName", 
                        label:"Фамилия", 
                        name: "performer_last_name",
                        width: 400,
                        labelWidth: 100,
                        align : 'center',
                        hidden: true
                    },
                    {
                        view:"select", 
                        id:"formWindowTaskStage", 
                        label: "Статус",
                        name: "status",
                        labelWidth: 100,
                        width: 400,
                        value: task_status[0],  
                        align : 'center',
                        options: task_status
                    },
                    {
                        view:"segmented", 
                        id:"formWindowTaskUrgently", 
                        width: 400,
                        name: "urgently",
                        value:1, 
                        align : 'center',
                        options: task_urgently,
                        css: "segment_btn_task_window",
                        
                    },
                    {
                        cols: [
                        {},
                        {cols: [
                            {rows: [
                                {
                                    view: "label",
                                    id: "formWindowTaskPlanTimeLabel",
                                    label: "Планируемое время выполнения:"
                                },
                                {
                                    view: "timeboard",
                                    id: "formWindowTaskPlanTime",
                                    name: "plan_time",
                                    twelve: false,
                                    width: 400
                                 },
                                 
                            ]},
                        ]},
                        {width: 34},
                        {cols: [
                            {rows: [
                                {
                                    view: "label",
                                    id: "formWindowTaskFactTimeLabel",
                                    label: "Фактическое время выполнения:"
                                },
                                {
                                    view: "timeboard",
                                    id: "formWindowTaskFactTime",
                                    name: "fact_time",
                                    twelve: false,
                                    width: 400
                                 },
                                 
                            ]},
                        ]},
                        {}
                    ]},
                    {cols: [
                        {},
                        {
                            view:"button", 
                            id:"taskWindowAddBtn", 
                            value:"Сохранить",
                            width: 150,
                            top: 20,
                            css: "webix_primary",
                        }, 
                        {
                            view:"button", 
                            id:"taskWindowClearBtn", 
                            value:"Очистить",
                            width: 150,
                            top: 20,
                            css: "webix_secondary",
                            hidden: true
                        }, 
                        {},
                    ]}
                ] 
            },    
        ],
        css:{"border-color":"orange"},
        rules:{
            "name": webix.rules.isNotEmpty,
            $obj:function(obj){

                if (!webix.rules.isNotEmpty(obj.name)) {
                    webix.message("Пожалуйста, введите название задачи", 'error')
                    return false
                }
                if ((obj.status == "3" || obj.status == "4") && FormatTime(obj.plan_time) == '00:00:00') {
                    webix.message("Пожалуйста, введите планируемое время", 'error')
                    return false
                }
                if (obj.status == "6" && FormatTime(obj.fact_time) == '00:00:00') {
                    webix.message("Пожалуйста, введите фактическое время", 'error')
                    return false
                }
                return true
            }
        }
    }
    }
}