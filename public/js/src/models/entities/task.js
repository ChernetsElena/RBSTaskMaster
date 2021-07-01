export class Task {
    constructor(
        id,
        projectID,  
        status,
        name, 
        description, 
        performerID,
        performer_name,
        performer_last_name, 
        urgently,
        plan_time, 
        fact_time
    ){
        this.id = id,
        this.projectID = projectID,
        this.status = status
        this.name = name
        this.description = description
        this.performerID = performerID
        this.performer_name = performer_name
        this.performer_last_name = performer_last_name
        this.urgently = urgently
        this.plan_time = plan_time
        this.fact_time = fact_time
    }
}

// export let TASK_STATUS = {

// }