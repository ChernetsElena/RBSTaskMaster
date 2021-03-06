package controllers

import (
	"taskmaster/app/helpers"
	"taskmaster/app/models/providers/position_provider"

	"github.com/revel/revel"
)

// CPosition
type CPosition struct {
	*revel.Controller
	provider *position_provider.PPosition
}

// Init интерцептор контроллера CPosition
func (c *CPosition) Init() revel.Result {
	var (
		err   error          // ошибка в ходе выполнения функции
		cache helpers.ICache // экземпляр кэша
	)

	// инициализация кэша
	cache, err = helpers.GetCache()
	if err != nil {
		revel.AppLog.Errorf("CPosition.Init : helpers.GetCache, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CPosition.Init : helpers.GetToken, %s\n", err)
		return c.Redirect((*CError).Unauthorized)
	}

	// проверка токена
	if isExist := cache.TokenIsActual(token); !isExist {
		return c.Redirect((*CError).Unauthorized)
	}

	// инициализация провайдера
	c.provider = new(position_provider.PPosition)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CPosition.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CEmployee
func (c *CPosition) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// GetAll получение всех должностей
func (c *CPosition) GetAll() revel.Result {
	// получение должностей
	positions, err := c.provider.GetPositions()
	if err != nil {
		revel.AppLog.Errorf("CPosition.GetAll : c.provider.GetEmployees, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CPosition.GetAll, positions: %+v\n", positions)

	// рендер положительного результата
	return c.RenderJSON(Succes(positions))
}
