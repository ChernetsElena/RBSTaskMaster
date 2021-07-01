export default function EmployeesView(){
    return {
        cols:[
                {
                    view:"datatable",
                    id: "employeeDatatable",
                    css: "employee_table",
                    hover: "hover_employee_table",
                    autoConfig:true,
                    scroll: "xy",
                    
                    columns:[
                        { id: 'ID', header: ['', { content: 'textFilter' }], hidden: true },
                        { id: 'last_name', header: ['Фамилия', { content: 'textFilter' }], sort: 'string', css:{'text-align':'center'}, fillspace: true, },
                        { id: 'name', header: ['Имя', { content: 'textFilter' }], sort: 'string', css:{'text-align':'center'}, fillspace: true, },
                        { id: 'middle_name', header: ['Отчество', { content: 'textFilter' }], sort: 'string', css:{'text-align':'center'}, fillspace: true, },
                        { id: 'position', header: ['Должность', { content:'selectFilter' }], sort: 'string', css:{'text-align':'center'}, fillspace: true, },
                        { id:"email",   header:["E-mail", { content: 'textFilter' }], sort: 'string', css:{'text-align':'center'}, fillspace: true, },
                        { id:"birth",   header:["Дата рождения", { content: 'textFilter' }], sort: 'string', css:{'text-align':'center'}, fillspace: true, format: webix.i18n.dateFormatStr},
                        { id:"edit", header: "", template:"{common.editIcon()}", width: 60},
                        { id:"trash", header: "", template:"{common.trashIcon()}", width: 60},
                    ],
                    data:[]
                },
        ]  
    }
}