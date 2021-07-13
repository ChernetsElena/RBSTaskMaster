package employee_provider

import (
	"database/sql"
	"taskmaster/app/helpers"
	"taskmaster/app/models/entities"
	"taskmaster/app/models/mappers"

	"github.com/revel/revel"
)

// PEmployee провайдер контроллера сотрудников
type PEmployee struct {
	employeeMapper  *mappers.MEmployee
	positionsMapper *mappers.MPosition
}

// Init
func (p *PEmployee) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PEmployee.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера сотрудников
	p.employeeMapper = mappers.InitEmployee(db)

	// инициализация маппера должностей
	p.positionsMapper =  mappers.InitPosition(db)

	return
}

// GetEmployees метод получения сотрудников
func (p *PEmployee) GetEmployees() (employees []*entities.Employee, err error) {
	var (
		edbts []*mappers.EmployeeDBType
		e     *entities.Employee
	)

	// получение данных сотрудников
	edbts, err = p.employeeMapper.SelectAll()
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployees : p.employeeMapper.SelectAll, %s\n", err)
		return
	}

	for _, edbt := range edbts {
		// преобразование к типу сущности
		e, err = edbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployees : edbt.ToType, %s\n", err)
			return
		}

		// получение значения должности по ключу
		e.Position, err = p.positionsMapper.PositionNameByID(edbt.Fk_position)
		if err != nil {
			revel.AppLog.Errorf("PEmployee.GetEmployees : p.positionsMapper.PositionNameByID, %s\n", err)
			return
		}

		employees = append(employees, e)
	}

	return
}

// CreateEmployee метод создания сотрудника
func (p *PEmployee) CreateEmployee(employee *entities.Employee) (e *entities.Employee, err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	// инициализация структур бд из струткур сущности
	edbt, err = edbt.FromType(*employee)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.CreateEmployee : edbt.FromType, %s\n", err)
		return
	}

	// получение внешнего ключа на должность
	edbt.Fk_position, err = p.positionsMapper.IDByPositionName(employee.Position)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.CreateEmployee : p.bookStatusMapper.IDByPositionName, %s\n", err)
		return
	}

	// добавление сотрудника
	employee.ID, err = p.employeeMapper.Insert(edbt)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.CreateEmployee : p.employeeMapper.Create, %s\n", err)
		return
	}

	return employee, nil
}

// UpdateEmployee метод обновления сотрудника
func (p *PEmployee) UpdateEmployee(employee *entities.Employee) (e *entities.Employee, err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	// инициализация структуры бд из струткуры сущности
	edbt, err = edbt.FromType(*employee)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.UpdateEmployee : edbt.FromType, %s\n", err)
		return
	}

	// получение внешнего ключа на должность
	edbt.Fk_position, err = p.positionsMapper.IDByPositionName(employee.Position)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.UpdateEmployee : p.positionsMapper.IDByPositionName, %s\n", err)
		return
	}

	// обновление сотрудника
	err = p.employeeMapper.Update(edbt)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.UpdateEmployee : p.employeeMapper.Update, %s\n", err)
		return
	}

	return employee, nil
}

// DeleteEmployee метод удаления сотрудника
func (p *PEmployee) DeleteEmployee(employee *entities.Employee) (err error) {
	var (
		edbt *mappers.EmployeeDBType
	)

	// инициализация структуры бд из струткуры сущности
	edbt, err = edbt.FromType(*employee)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.DeleteEmployee : edbt.FromType, %s\n", err)
		return
	}

	// удаление сотрудника
	err = p.employeeMapper.Delete(edbt)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.DeleteEmployee : p.employeeMapper.Update, %s\n", err)
		return
	}

	return
}

// GetEmployeeByID метод получения сотрудника по id
func (p *PEmployee) GetEmployeeByID(id int64) (e *entities.Employee, err error) {
	var (
		bdbt *mappers.EmployeeDBType
	)

	// получение данных сотрудника
	bdbt, err = p.employeeMapper.SelectByID(id)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByID : p.employeeMapper.SelectByID, %s\n", err)
		return
	}

	// преобразование к типу сущности
	e, err = bdbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByID : bdbt.ToType, %s\n", err)
		return
	}

	// получение значения должности по ключу
	e.Position, err = p.positionsMapper.PositionNameByID(bdbt.Fk_position)
	if err != nil {
		revel.AppLog.Errorf("PEmployee.GetEmployeeByID : p.positionsMapper.PositionNameByID, %s\n", err)
		return
	}

	return
}
