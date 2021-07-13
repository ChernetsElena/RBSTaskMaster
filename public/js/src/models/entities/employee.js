// Employee класс для представления сущности сотрудника
export class Employee {
    constructor(
        id,
        position, 
        name,
        last_name,
        middle_name,
        email,
        birth
    ){
        this.id = id,
        this.position = position
        this.name = name
        this.last_name = last_name
        this.middle_name = middle_name
        this.email = email,
        this.birth = birth
    }
}