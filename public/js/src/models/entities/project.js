// Project класс для представления сущности проекта
export class Project {
    constructor(
        id,
        name, 
        description, 
        teamleadID, 
        teamlead_name,
        teamlead_last_name,
        color_one, 
        color_two
    ){
        this.id = id,
        this.name = name
        this.description = description
        this.teamleadID = teamleadID
        this.teamlead_name = teamlead_name
        this.teamlead_last_name = teamlead_last_name
        this.color_one = color_one
        this.color_two = color_two
    }
}