package controllers

import (
	"taskmaster/app/helpers"
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
		err   error          // ошибка в ходе выполнения функции
		cache helpers.ICache // экземпляр кэша
	)

	// инициализация кэша
	cache, err = helpers.GetCache()
	if err != nil {
		revel.AppLog.Errorf("CBook.Init : helpers.GetCache, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CAuth.Check : helpers.GetToken, %s\n", err)
		return c.Redirect((*CError).Unauthorized)
	}

	// проверка токена
	if isExist := cache.TokenIsActual(token); !isExist {
		return c.Redirect((*CError).Unauthorized)
	}

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
