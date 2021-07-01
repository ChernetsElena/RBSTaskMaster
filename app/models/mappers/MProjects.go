package mappers

import (
	"database/sql"
	"taskmaster/app/models/entities"

	"github.com/revel/revel"
)

// ProjectDBType тип сущности "проект" бд
type ProjectDBType struct {
	Pk_id         int64  // идентификатор
	Fk_teamlead   int64  // FK на тимлида
	C_name        string // название
	C_description string // описание
	C_color_one   string // цвет 1
	C_color_two   string // цвет 2
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *ProjectDBType) ToType() (e *entities.Project, err error) {
	e = new(entities.Project)

	e.ID = dbt.Pk_id
	e.Name = dbt.C_name
	e.TeamleadID = dbt.Fk_teamlead
	e.Description = dbt.C_description
	e.ColorOne = dbt.C_color_one
	e.ColorTwo = dbt.C_color_two

	return
}

// FromType функция преобразования типа сущности к типу бд
// допускается, что dbt is nil
func (_ *ProjectDBType) FromType(e entities.Project) (dbt *ProjectDBType, err error) {
	dbt = &ProjectDBType{

		Pk_id:         e.ID,
		Fk_teamlead:   e.TeamleadID,
		C_name:        e.Name,
		C_description: e.Description,
		C_color_one:   e.ColorOne,
		C_color_two:   e.ColorTwo,
	}

	return
}

// MProject маппер проектов
type MProject struct {
	db *sql.DB
}

// Init
func InitProject(db *sql.DB) *MProject {

	return &MProject{
		db: db,
	}

}

// SelectAll получение всех проектов
func (m *MProject) SelectAll() (projects []*ProjectDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			fk_teamlead,
			c_name,
			c_description,
			c_color_one,
			c_color_two
		FROM "taskmaster".t_projects
		ORDER BY pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		e := new(ProjectDBType)

		// считывание строки выборки
		err = rows.Scan(
			&e.Pk_id,         // pk_id
			&e.Fk_teamlead,   // fk_position
			&e.C_name,        // c_name
			&e.C_description, // c_description
			&e.C_color_one,   // c_color_one
			&e.C_color_two,   // c_color_two
		)
		if err != nil {
			revel.AppLog.Errorf("MProject.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		projects = append(projects, e)
	}

	return
}

// SelectByID получение проекта по ID
func (m *MProject) SelectByID(id int64) (e *ProjectDBType, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	e = new(ProjectDBType)

	// запрос
	query = `
		SELECT
			pk_id,
			fk_teamlead,
			c_name,
			c_description,
			c_color_one,
			c_color_two
		FROM taskmaster.t_projects
		WHERE pk_id = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(
		&e.Pk_id,         // pk_id
		&e.Fk_teamlead,   // fk_teamlead
		&e.C_name,        // c_firstname
		&e.C_description, // c_description
		&e.C_color_one,   // c_color_two
		&e.C_color_two,   // c_color_one
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.SelectByID : row.Scan, %s\n", err)
		return
	}

	return
}

// Insert добавление проекта
func (m *MProject) Insert(edbt *ProjectDBType) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		INSERT INTO "taskmaster".t_projects(
			fk_teamlead,
			c_name,
			c_description,
			c_color_one,
			c_color_two
		)
		VALUES(
			$1,	-- fk_teamlead
			$2,	-- c_name
			$3,	-- c_description
			$4,	-- c_color_one
			$5	-- c_color_two
		)
		returning pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query,
		edbt.Fk_teamlead,   // fk_teamlead
		edbt.C_name,        // c_name
		edbt.C_description, // c_description
		edbt.C_color_one,   // c_color_two
		edbt.C_color_two,   // c_color_one
	)

	// считывание id
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.Insert : row.Scan, %s\n", err)
		return
	}

	return
}

// Update изменение проекта
func (m *MProject) Update(edbt *ProjectDBType) (err error) {
	var (
		query string // строка запроса
	)

	revel.AppLog.Debugf("MProject.Update, edbt: %+v\n", edbt)

	// запрос
	query = `
		UPDATE taskmaster.t_projects
		SET 
			fk_teamlead = $2,
			c_name = $3,
			c_description = $4,
			c_color_one = $5,
			c_color_two = $6
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query,
		edbt.Pk_id,         // pk_id
		edbt.Fk_teamlead,   // fk_teamlead
		edbt.C_name,        // c_name
		edbt.C_description, // c_description
		edbt.C_color_one,   // c_color_one
		edbt.C_color_two,   // color_two
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.Update : m.db.Exec, %s\n", err)
		return
	}

	return
}

// Delete удаление проекта
func (m *MProject) Delete(edbt *ProjectDBType) (err error) {
	var (
		query string // строка запроса
	)

	// запрос
	query = `
		DELETE FROM taskmaster.t_projects
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query, edbt.Pk_id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MProject.Delete : m.db.Exec, %s\n", err)
		return
	}

	return
}
