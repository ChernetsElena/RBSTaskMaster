package controllers

import (
	"encoding/json"
	"io/ioutil"
	"taskmaster/app/helpers"
	"taskmaster/app/models/entities"
	"taskmaster/app/models/providers/project_provider"

	"github.com/revel/revel"
)

// CProject
type CProject struct {
	*revel.Controller
	provider *project_provider.PProject
}

// Init интерцептор контроллера CProject
func (c *CProject) Init() revel.Result {
	var (
		cache helpers.ICache // экземпляр кэша
		err   error          // ошибка в ходе выполнения функции
	)

	// инициализация кэша
	cache, err = helpers.GetCache()
	if err != nil {
		revel.AppLog.Errorf("CProject.Init : helpers.GetCache, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CProject.Init : helpers.GetToken, %s\n", err)
		return c.Redirect((*CError).Unauthorized)
	}

	// проверка токена
	if isExist := cache.TokenIsActual(token); !isExist {
		return c.Redirect((*CError).Unauthorized)
	}

	// инициализация провайдера
	c.provider = new(project_provider.PProject)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CProject.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CProject
func (c *CProject) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// GetAll получение всех проектов
func (c *CProject) GetAll() revel.Result {
	// получение отрудников
	projects, err := c.provider.GetProjects()
	if err != nil {
		revel.AppLog.Errorf("CProject.GetAll : c.provider.GetProjects, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.GetAll, projects: %+v\n", projects)

	// рендер положительного результата
	return c.RenderJSON(Succes(projects))
}

// GetByID получение проекта по id
func (c *CProject) GetByID(id int64) revel.Result {
	// получение проекта
	project, err := c.provider.GetProjectByID(id)
	if err != nil {
		revel.AppLog.Errorf("CProject.GetByID : c.provider.GetProjectByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// рендер положительного результата
	return c.RenderJSON(Succes(project))
}

// Create создание проекта
func (c *CProject) Create() revel.Result {
	var (
		project *entities.Project // экземпляр сущности для создания
		err     error             // ошибка в ходе выполнения функции
	)

	// формирование сущности для создания из post параметров
	project, err = c.fetchPostProject()
	if err != nil {
		revel.AppLog.Errorf("CProject.Create : c.fetchPostProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// создание сущности
	project, err = c.provider.CreateProject(project)
	if err != nil {
		revel.AppLog.Errorf("CProject.Create : c.provider.CreateProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.Create, project: %+v\n", project)

	// рендер положительного результата
	return c.RenderJSON(Succes(project))
}

// UpdateEmployee изменение поекта
func (c *CProject) Update() revel.Result {
	var (
		project *entities.Project // экземпляр сущности для обновления
		err     error             // ошибка в ходе выполнения функции
	)

	// формирование сущности для обновления из post параметров
	project, err = c.fetchPostProject()
	if err != nil {
		revel.AppLog.Errorf("CProject.Update : c.fetchPostProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// обновление сущности
	project, err = c.provider.UpdateProject(project)
	if err != nil {
		revel.AppLog.Errorf("CProject.Update : c.provider.UpdateProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.Update, project: %+v\n", project)

	// рендер положительного результата
	return c.RenderJSON(Succes(project))
}

// DeleteEmployee удаление проекта
func (c *CProject) Delete() revel.Result {
	var (
		project *entities.Project // экземпляр сущности для удаления
		err     error             // ошибка в ходе выполнения функции
	)

	// формирование сущности для удаления из post параметров
	project, err = c.fetchPostProject()
	if err != nil {
		revel.AppLog.Errorf("CProject.Delete : c.fetchPostProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// удаление сущности
	err = c.provider.DeleteProject(project)
	if err != nil {
		revel.AppLog.Errorf("CProject.Delete : c.provider.DeleteProject, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CProject.Delete , project: %+v\n", project)

	// рендер положительного результата
	return c.RenderJSON(Succes(nil))
}

// fetchPostProject метод получения сущности из post параметров
func (c *CProject) fetchPostProject() (e *entities.Project, err error) {
	var (
		rowRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rowRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CProject.fetchPostProject : ioutil.ReadAll, %s\n", err)
		return
	}

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rowRequest, &e)
	if err != nil {
		revel.AppLog.Errorf("CProject.fetchPostProject : json.Unmarshal, %s\n", err)
		return
	}

	revel.AppLog.Debugf("CProject.fetchPostProject, projects: %+v\n", e)

	return
}
