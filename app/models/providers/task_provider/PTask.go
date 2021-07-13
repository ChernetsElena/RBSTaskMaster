package task_provider

import (
	"database/sql"
	"taskmaster/app/helpers"
	"taskmaster/app/models/entities"
	"taskmaster/app/models/mappers"

	"github.com/revel/revel"
)

// PTask провайдер контроллера задач
type PTask struct {
	taskMapper     *mappers.MTask
	employeeMapper *mappers.MEmployee
}

// Init
func (p *PTask) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PTask.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера задач
	p.taskMapper = mappers.InitTask(db)

	p.employeeMapper = mappers.InitEmployee(db)
	return
}

// GetTasksByProjectId метод получения задач
func (p *PTask) GetTasksByProjectId(id int64) (tasks []*entities.Task, err error) {
	var (
		pdbts []*mappers.TaskDBType
		e     *entities.Task
	)

	// получение данных задач
	pdbts, err = p.taskMapper.SelectByProjectId(id)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetTasksByProjectId : p.taskMapper.SelectByProjectId, %s\n", err)
		return
	}

	for _, pdbt := range pdbts {
		// преобразование к типу сущности
		e, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PTask.GetTasksByProjectId : edbt.ToType, %s\n", err)
			return
		}

		// получение имени тимлида по ключу
		e.PerformerName, err = p.employeeMapper.GetNameByID(pdbt.Fk_performer.Int64)
		if err != nil {
			revel.AppLog.Errorf("PTask.GetTasksByProjectId : p.employeeMapper.GetNameByID, %s\n", err)
			return
		}

		// получение фамилии тимлида по ключу
		e.PerformerLastName, err = p.employeeMapper.GetLastNameByID(pdbt.Fk_performer.Int64)
		if err != nil {
			revel.AppLog.Errorf("PTask.GetTasksByProjectId : p.employeeMapper.GetLastNameByID, %s\n", err)
			return
		}

		tasks = append(tasks, e)
	}

	return
}

// CreateTask метод создания задачи
func (p *PTask) CreateTask(task *entities.Task) (e *entities.Task, err error) {
	var (
		pdbt *mappers.TaskDBType
	)

	// инициализация структур бд из струткур сущности
	pdbt, err = pdbt.FromType(*task)
	if err != nil {
		revel.AppLog.Errorf("PTask.CreateTask : edbt.FromType, %s\n", err)
		return
	}

	// добавление задачи
	task.ID, err = p.taskMapper.Insert(pdbt)
	if err != nil {
		revel.AppLog.Errorf("PTask.CreateTask : p.taskMapper.Create, %s\n", err)
		return
	}

	return task, nil
}

// UpdateTask метод обновления задачи
func (p *PTask) UpdateTask(task *entities.Task) (e *entities.Task, err error) {
	var (
		pdbt *mappers.TaskDBType
	)

	// инициализация структуры бд из струткуры сущности
	pdbt, err = pdbt.FromType(*task)
	if err != nil {
		revel.AppLog.Errorf("PTask.UpdateTask : pdbt.FromType, %s\n", err)
		return
	}

	// обновление задачи
	err = p.taskMapper.Update(pdbt)
	if err != nil {
		revel.AppLog.Errorf("PTask.UpdateTask : p.taskMapper.Update, %s\n", err)
		return
	}

	return task, nil
}

// DeleteTask метод удаления задачи
func (p *PTask) DeleteTask(task *entities.Task) (err error) {
	var (
		pdbt *mappers.TaskDBType
	)

	// инициализация структуры бд из струткуры сущности
	pdbt, err = pdbt.FromType(*task)
	if err != nil {
		revel.AppLog.Errorf("PTask.DeleteTask : edbt.FromType, %s\n", err)
		return
	}

	// удаление задачи
	err = p.taskMapper.Delete(pdbt)
	if err != nil {
		revel.AppLog.Errorf("PTask.DeleteTask : p.taskMapper.Update, %s\n", err)
		return
	}

	return
}

// GetTaskByID метод получения задачи по id
func (p *PTask) GetTaskByID(id int64) (e *entities.Task, err error) {
	var (
		pdbt *mappers.TaskDBType
	)

	// получение данных задачи
	pdbt, err = p.taskMapper.SelectByID(id)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetTaskByID : p.taskMapper.GetTaskByID, %s\n", err)
		return
	}

	// преобразование к типу сущности
	e, err = pdbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PTask.GetTaskByID : pdbt.ToType, %s\n", err)
		return
	}

	// получение имени тимлида по ключу
	e.PerformerName, err = p.employeeMapper.GetNameByID(pdbt.Fk_performer.Int64)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetTaskByID : p.employeeMapper.GetNameByID, %s\n", err)
		return
	}

	// получение фамилии тимлида по ключу
	e.PerformerLastName, err = p.employeeMapper.GetLastNameByID(pdbt.Fk_performer.Int64)
	if err != nil {
		revel.AppLog.Errorf("PTask.GetTaskByID : p.employeeMapper.GetLastNameByID, %s\n", err)
		return
	}

	return
}
