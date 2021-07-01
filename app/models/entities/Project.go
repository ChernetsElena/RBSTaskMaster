package entities

// Project структура сущности проекта
type Project struct {
	ID               int64  `json:"ID"`                 // идентификатор проекта
	Name             string `json:"name"`               // название проекта
	Description      string `json:"description"`        // описание проекта
	TeamleadID       int64  `json:"teamleadID"`         // идентификатор тимлида
	TeamleadName     string `json:"teamlead_name"`      // имя тимлида
	TeamleadLastName string `json:"teamlead_last_name"` // фамилия тимлида
	ColorOne         string `json:"color_one"`          // цвет проекта 1
	ColorTwo         string `json:"color_two"`          // цвет проекта 2
}
