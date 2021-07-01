package project_provider

import (
	"database/sql"
	"taskmaster/app/helpers"
	"taskmaster/app/models/entities"
	"taskmaster/app/models/mappers"

	"github.com/revel/revel"
)

// PProject провайдер контроллера сотрудников
type PProject struct {
	projectMapper  *mappers.MProject
	employeeMapper *mappers.MEmployee
}

// Init
func (p *PProject) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PProject.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера проектов
	p.projectMapper = mappers.InitProject(db)

	p.employeeMapper = mappers.InitEmployee(db)

	return
}

// GetProjects метод получения проектов
func (p *PProject) GetProjects() (projects []*entities.Project, err error) {
	var (
		pdbts []*mappers.ProjectDBType
		e     *entities.Project
	)

	// получение данных проектов
	pdbts, err = p.projectMapper.SelectAll()
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjects : p.projectMapper.SelectAll, %s\n", err)
		return
	}

	for _, pdbt := range pdbts {
		// преобразование к типу сущности
		e, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjects : edbt.ToType, %s\n", err)
			return
		}

		// получение имени тимлида по ключу
		e.TeamleadName, err = p.employeeMapper.GetNameByID(pdbt.Fk_teamlead)
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjects : p.employeeMapper.GetNameByID, %s\n", err)
			return
		}

		// получение фамилии тимлида по ключу
		e.TeamleadLastName, err = p.employeeMapper.GetLastNameByID(pdbt.Fk_teamlead)
		if err != nil {
			revel.AppLog.Errorf("PProject.GetProjects : p.employeeMapper.GetLastNameByID, %s\n", err)
			return
		}

		projects = append(projects, e)
	}

	return
}

// CreateProject метод создания проекта
func (p *PProject) CreateProject(project *entities.Project) (e *entities.Project, err error) {
	var (
		pdbt *mappers.ProjectDBType
	)

	// инициализация структур бд из струткур сущности
	pdbt, err = pdbt.FromType(*project)
	if err != nil {
		revel.AppLog.Errorf("PProject.CreateProject : edbt.FromType, %s\n", err)
		return
	}

	// добавление проекта
	project.ID, err = p.projectMapper.Insert(pdbt)
	if err != nil {
		revel.AppLog.Errorf("PProject.CreateProject : p.projectMapper.Create, %s\n", err)
		return
	}

	return project, nil
}

// UpdateProject метод обновления проекта
func (p *PProject) UpdateProject(project *entities.Project) (e *entities.Project, err error) {
	var (
		pdbt *mappers.ProjectDBType
	)

	// инициализация структуры бд из струткуры сущности
	pdbt, err = pdbt.FromType(*project)
	if err != nil {
		revel.AppLog.Errorf("PProject.UpdateProject : pdbt.FromType, %s\n", err)
		return
	}

	// обновление проекта
	err = p.projectMapper.Update(pdbt)
	if err != nil {
		revel.AppLog.Errorf("PProject.UpdateProject : p.projectMapper.Update, %s\n", err)
		return
	}

	return project, nil
}

// DeleteProject метод удаления проекта
func (p *PProject) DeleteProject(project *entities.Project) (err error) {
	var (
		pdbt *mappers.ProjectDBType
	)

	// инициализация структуры бд из струткуры сущности
	pdbt, err = pdbt.FromType(*project)
	if err != nil {
		revel.AppLog.Errorf("PProject.DeleteProject : edbt.FromType, %s\n", err)
		return
	}

	// удаление проекта
	err = p.projectMapper.Delete(pdbt)
	if err != nil {
		revel.AppLog.Errorf("PProject.DeleteProject : p.projectMapper.Update, %s\n", err)
		return
	}

	return
}

// GetProjectByID метод получения проекта по id
func (p *PProject) GetProjectByID(id int64) (e *entities.Project, err error) {
	var (
		pdbt *mappers.ProjectDBType
	)

	// получение данных проекта
	pdbt, err = p.projectMapper.SelectByID(id)
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectByID : p.projectMapper.GetProjectByID, %s\n", err)
		return
	}

	// преобразование к типу сущности
	e, err = pdbt.ToType()
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectByID : pdbt.ToType, %s\n", err)
		return
	}

	// получение имени тимлида по ключу
	e.TeamleadName, err = p.employeeMapper.GetNameByID(pdbt.Fk_teamlead)
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectByID : p.employeeMapper.GetNameByID, %s\n", err)
		return
	}

	// получение фамилии тимлида по ключу
	e.TeamleadLastName, err = p.employeeMapper.GetLastNameByID(pdbt.Fk_teamlead)
	if err != nil {
		revel.AppLog.Errorf("PProject.GetProjectByID : p.employeeMapper.GetLastNameByID, %s\n", err)
		return
	}

	return
}
