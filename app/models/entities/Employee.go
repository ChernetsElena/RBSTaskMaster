package entities

import "time"

// Employee структура сущности сотрудника
type Employee struct {
	ID         int64      `json:"ID"`          // идентификатор проекта
	Position   string     `json:"position"`    // должность
	Name       string     `json:"name"`        // имя сотрудника
	LastName   string     `json:"last_name"`   // фамилия сотрудника
	MiddleName *string    `json:"middle_name"` // отчество сотрудника
	Email      string     `json:"email"`       // почта сотрудника
	Birth      *time.Time `json:"birth"`       // день рождения сотрудника
}
