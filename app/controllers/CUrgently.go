package controllers

import (
	"taskmaster/app/models/providers/urgently_provider"

	"github.com/revel/revel"
)

// CUrgently
type CUrgently struct {
	*revel.Controller
	provider *urgently_provider.PUrgently
}

// Init интерцептор контроллера CUrgently
func (c *CUrgently) Init() revel.Result {
	var (
		err error // ошибка в ходе выполнения функции
	)

	// инициализация провайдера
	c.provider = new(urgently_provider.PUrgently)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("PUrgently.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CUrgently
func (c *CUrgently) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// GetAll получение всех срочностей
func (c *CUrgently) GetAll() revel.Result {
	// получение срочностей
	urgently, err := c.provider.GetUrgently()
	if err != nil {
		revel.AppLog.Errorf("CUrgently.GetAll : c.provider.GetUrgently, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CUrgently.GetAll, urgently: %+v\n", urgently)

	// рендер положительного результата
	return c.RenderJSON(Succes(urgently))
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
