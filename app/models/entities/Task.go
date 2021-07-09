package entities

// Task структура сущности задачи
type Task struct {
	ID                int64   `json:"ID"`                  // идентификатор задачи
	ProjectID         int64   `json:"projectID"`           // идентификатор проекта
	Name              string  `json:"name"`                // название задачи
	Description       *string `json:"description"`         // описание задачи
	PerformerID       int64   `json:"performerID"`         // идентификатор исполнителя
	PerformerName     string  `json:"performer_name"`      // имя исполнителя
	PerformerLastName string  `json:"performer_last_name"` // фамилия исполнителя
	Urgently          int64   `json:"urgently"`            // идентификатор срочности
	PlanTime          string  `json:"plan_time"`           // планируемое время исполнения
	FactTime          string  `json:"fact_time"`           // фактическое время исполнения
	Status            int64   `json:"status"`              // идентификатор статуса задачи
}
