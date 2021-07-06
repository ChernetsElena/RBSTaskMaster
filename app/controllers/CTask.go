package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"taskmaster/app/helpers"
	"taskmaster/app/models/entities"
	"taskmaster/app/models/providers/task_provider"

	"github.com/revel/revel"
)

// CTask
type CTask struct {
	*revel.Controller
	provider *task_provider.PTask
}

// Init интерцептор контроллера CTask
func (c *CTask) Init() revel.Result {
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
	c.provider = new(task_provider.PTask)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CTask.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CTask
func (c *CTask) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// GetAll получение всех задач проекта
func (c *CTask) GetAllByProject(id int64) revel.Result {
	// получение задач
	tasks, err := c.provider.GetTasksByProjectId(id)
	if err != nil {
		revel.AppLog.Errorf("CTask.GetAll : c.provider.GetTasksByProjectId, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CTask.GetAllByProject, tasks: %+v\n", tasks)

	// рендер положительного результата
	fmt.Printf("\n\n%v\n\n", tasks)
	return c.RenderJSON(Succes(tasks))
}

// GetByID получение задачи по id
func (c *CTask) GetByID(id int64) revel.Result {
	// получение задачи
	task, err := c.provider.GetTaskByID(id)
	if err != nil {
		revel.AppLog.Errorf("CTask.GetByID : c.provider.GetTaskByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// рендер положительного результата
	return c.RenderJSON(Succes(task))
}

// Create создание задачи
func (c *CTask) Create() revel.Result {
	var (
		task *entities.Task // экземпляр сущности для создания
		err  error          // ошибка в ходе выполнения функции
	)

	// формирование сущности для создания из post параметров
	task, err = c.fetchPostTask()
	if err != nil {
		revel.AppLog.Errorf("CTask.Create : c.fetchPostTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// создание сущности
	task, err = c.provider.CreateTask(task)
	if err != nil {
		revel.AppLog.Errorf("CTask.Create : c.provider.CreateTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CTask.Create, task: %+v\n", task)

	// рендер положительного результата
	return c.RenderJSON(Succes(task))
}

// Update изменение задачи
func (c *CTask) Update() revel.Result {
	var (
		task *entities.Task // экземпляр сущности для обновления
		err  error          // ошибка в ходе выполнения функции
	)

	// формирование сущности для обновления из post параметров
	task, err = c.fetchPostTask()
	fmt.Printf("\n\nTaskUpdate, TASK: %v\n\n", task)
	if err != nil {
		revel.AppLog.Errorf("CTask.Update : c.fetchPostTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// обновление сущности
	task, err = c.provider.UpdateTask(task)
	if err != nil {
		revel.AppLog.Errorf("CTask.Update : c.provider.UpdateTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CTask.Update, task: %+v\n", task)

	// рендер положительного результата
	return c.RenderJSON(Succes(task))
}

// DeleteEmployee удаление задачи
func (c *CTask) Delete() revel.Result {
	var (
		task *entities.Task // экземпляр сущности для удаления
		err  error          // ошибка в ходе выполнения функции
	)

	// формирование сущности для удаления из post параметров
	task, err = c.fetchPostTask()
	if err != nil {
		revel.AppLog.Errorf("CTask.Delete : c.fetchPostTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// удаление сущности
	err = c.provider.DeleteTask(task)
	if err != nil {
		revel.AppLog.Errorf("CTask.Delete : c.provider.DeleteTask, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CTask.Delete , task: %+v\n", task)

	// рендер положительного результата
	return c.RenderJSON(Succes(nil))
}

// fetchPostTask метод получения сущности из post параметров
func (c *CTask) fetchPostTask() (e *entities.Task, err error) {
	var (
		rawRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rawRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CTask.fetchPostTask : ioutil.ReadAll, %s\n", err)
		return
	}

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rawRequest, &e)

	if err != nil {
		revel.AppLog.Errorf("CTask.fetchPostTask : json.Unmarshal, %s\n", err)
		return
	}

	revel.AppLog.Debugf("CTask.fetchPostTask, tasks: %+v\n", e)

	return
}
