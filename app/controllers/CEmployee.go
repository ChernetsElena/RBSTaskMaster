package controllers

import (
	"encoding/json"
	"io/ioutil"
	"taskmaster/app/helpers"
	"taskmaster/app/models/entities"
	"taskmaster/app/models/providers/employee_provider"

	"github.com/revel/revel"
)

// CEmployee
type CEmployee struct {
	*revel.Controller
	provider *employee_provider.PEmployee
	cache helpers.ICache
}

// Init интерцептор контроллера CEmployee
func (c *CEmployee) Init() revel.Result {
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
	c.provider = new(employee_provider.PEmployee)
	err = c.provider.Init()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Init : c.provider.Init, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	return nil
}

// Destroy контроллера CEmployee
func (c *CEmployee) Destroy() {
	c.Controller.Destroy()

	// удаление ссылки на провайдер
	c.provider = nil
}

// GetAll получение всех сотрудников
func (c *CEmployee) GetAll() revel.Result {
	// получение отрудников
	employees, err := c.provider.GetEmployees()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.GetAll : c.provider.GetEmployees, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.GetAll, employees: %+v\n", employees)

	// рендер положительного результата
	return c.RenderJSON(Succes(employees))
}

// GetByID получение сотрудника по id
func (c *CEmployee) GetByID(id int64) revel.Result {
	// получение сотрудника
	employee, err := c.provider.GetEmployeeByID(id)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.GetByID : c.provider.GetEmployeeByID, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// рендер положительного результата
	return c.RenderJSON(Succes(employee))
}

// Create создание сотрудника
func (c *CEmployee) Create() revel.Result {
	var (
		employee *entities.Employee // экземпляр сущности для создания
		err      error              // ошибка в ходе выполнения функции
	)

	// формирование сущности для создания из post параметров
	employee, err = c.fetchPostEmployee()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Create : c.fetchPostEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// создание сущности
	employee, err = c.provider.CreateEmployee(employee)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Create : c.provider.CreateEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.Create, employee: %+v\n", employee)

	// рендер положительного результата
	return c.RenderJSON(Succes(employee))
}

// UpdateEmployee изменение сотрудника
func (c *CEmployee) Update() revel.Result {
	var (
		employee *entities.Employee // экземпляр сущности для обновления
		err      error              // ошибка в ходе выполнения функции
		isAuthorizeEmployee bool	// переменная для проверки авторизованности обновляемого сотрудника
		cache helpers.ICache 		// экземпляр кэша
	)

	// инициализация кэша
	cache, err = helpers.GetCache()

	// получение токена клиента
	token, err := helpers.GetToken(c.Controller)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Update : helpers.GetToken, %s\n", err)
		return c.Redirect((*CError).Unauthorized)
	}
	// получение токена сервера для пользователя
	u, err := cache.Get(token)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Update : c.cache.Get, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	// формирование сущности для обновления из post параметров
	employee, err = c.fetchPostEmployee()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Update : c.fetchPostEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// проверка авторизованности обновляемого сотрудника
	isAuthorizeEmployee = u.Employee.ID == employee.ID

	// обновление данных кэша
	if isAuthorizeEmployee == true {
		u.Employee.Name = employee.Name
		u.Employee.LastName = employee.LastName
		err = cache.Set(token, u)
		if err != nil {
			revel.AppLog.Errorf("CEmployee.Update : c.cache.Set, %s\n", err)
			return c.RenderJSON(Failed(err.Error()))
		}
	}
	
	// обновление сущности
	employee, err = c.provider.UpdateEmployee(employee)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Update : c.provider.UpdateEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.Update, employee: %+v\n", employee)

	// рендер положительного результата
	return c.RenderJSON(Succes(employee))
}

// DeleteEmployee удаление сотрудника
func (c *CEmployee) Delete() revel.Result {
	var (
		employee *entities.Employee // экземпляр сущности для удаления
		err      error              // ошибка в ходе выполнения функции
	)

	// формирование сущности для удаления из post параметров
	employee, err = c.fetchPostEmployee()
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Delete : c.fetchPostEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}

	// удаление сущности
	err = c.provider.DeleteEmployee(employee)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.Delete : c.provider.DeleteEmployee, %s\n", err)
		return c.RenderJSON(Failed(err.Error()))
	}
	revel.AppLog.Debugf("CEmployee.Delete , employee: %+v\n", employee)

	// рендер положительного результата
	return c.RenderJSON(Succes(nil))
}

// fetchPostEmployee метод получения сущности из post параметров
func (c *CEmployee) fetchPostEmployee() (e *entities.Employee, err error) {
	var (
		rawRequest []byte // байтовое представление тела запроса
	)

	// получение тела запроса
	rawRequest, err = ioutil.ReadAll(c.Request.GetBody())
	if err != nil {
		revel.AppLog.Errorf("CEmployee.fetchPostEmployee : ioutil.ReadAll, %s\n", err)
		return
	}

	// преобразование тела запроса в структуру сущности
	err = json.Unmarshal(rawRequest, &e)
	if err != nil {
		revel.AppLog.Errorf("CEmployee.fetchPostEmployee : json.Unmarshal, %s\n", err)
		return
	}

	revel.AppLog.Debugf("CEmployee.fetchPostEmployee, employees: %+v\n", e)

	return
}
