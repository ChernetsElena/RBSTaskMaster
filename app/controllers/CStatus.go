package controllers

import (
	"taskmaster/app/models/providers/status_provider"

	"github.com/revel/revel"
)

// CStatus
type CStatus struct {
	*revel.Controller
	provider *status_provider.PStatus
}

// Init интерцептор контроллера CStatus
func (c *CStatus) Init() revel.Result {
	var (
		err error // ошибка в ходе выполнения функции
	)

	// инициализация провайдера
	c.provider = new(status_provider.PStatus)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("PStatus.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CStatus
func (c *CStatus) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// GetAll получение всех статусов
func (c *CStatus) GetAll() revel.Result {
	// получение статусов
	statuses, err := c.provider.GetStatuses()
	if err != nil {
		revel.AppLog.Errorf("CStatus.GetAll : c.provider.GetStatuses, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CStatus.GetAll, statuses: %+v\n", statuses)

	// рендер положительного результата
	return c.RenderJSON(Succes(statuses))
}

// GetByID получение должности по id
// func (c *CPosition) GetByID(id int64) revel.Result {
// 	// получение сотрудника
// 	position, err := c.provider.GetPositionById(id)
// 	if err != nil {
// 		revel.AppLog.Errorf("CPosition.GetByID : c.provider.GetPositionByID, %s\n", err)
// 		return c.RenderJSON(Failed(err.Error()))
// 	}

// 	// рендер положительного результата
// 	return c.RenderJSON(Succes(position))
// }
