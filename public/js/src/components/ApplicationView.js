
export default function ApplicationView(
    Toolbar, 
    Project, 
    ProjectsButton, 
    Employee, 
    EmployeesButton, 
    Tasks,
    TasksButton){
    return {
        id: 'workedPlace',
        
        rows: [
            Toolbar.config(),
            {
                view: "multiview",
                id: "appMultiview",
                cells: [
                    {
                        id: "projectRow",
                        rows: [
                        Project.config(),
                        ProjectsButton.config()
                    ]},
                    {
                        id: "tasksRow",
                        rows: [
                        Tasks.config(),
                        TasksButton.config(),
                    ]},

                    {
                        id: "employeeRow",
                        rows: [
                        Employee.config(),
                        EmployeesButton.config()
                    ]},
                ]
            }
            
        ]
    }
}