package entities

// Status структура сущности статуса
type Status struct {
	ID   int64  `json:"ID"`    // идентификатор
	Name string `json:"value"` // название статуса
}
