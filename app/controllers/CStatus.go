package controllers

import (
	"taskmaster/app/helpers"
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
		err   error          // ошибка в ходе выполнения функции
		cache helpers.ICache // экземпляр кэша
	)

	// инициализация кэша
	cache, err = helpers.GetCache()
	if err != nil {
		revel.AppLog.Errorf("CStatus.Init : helpers.GetCache, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CStatus.Init : helpers.GetToken, %s\n", err)
		return c.Redirect((*CError).Unauthorized)
	}

	// проверка токена
	if isExist := cache.TokenIsActual(token); !isExist {
		return c.Redirect((*CError).Unauthorized)
	}

	// инициализация провайдера
	c.provider = new(status_provider.PStatus)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CStatus.Init : c.provider.Init, %s\n", err)
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
