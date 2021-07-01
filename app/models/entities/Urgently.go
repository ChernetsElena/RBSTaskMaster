package entities

// Urgently структура сущности срочности
type Urgently struct {
	ID   int64  `json:"ID"`    // идентификатор
	Name string `json:"value"` // название срочности
}
