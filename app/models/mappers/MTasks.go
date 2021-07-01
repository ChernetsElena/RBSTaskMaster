package mappers

import (
	"database/sql"
	"fmt"
	"taskmaster/app/models/entities"

	"github.com/revel/revel"
)

// TaskDBType тип сущности "задача" бд
type TaskDBType struct {
	Pk_id         int64          // идентификатор
	Fk_performer  sql.NullInt64  // FK на исполнителя
	Fk_project    int64          // FK на проект
	Fk_status     int64          // FK на статус
	Fk_urgently   int64          // FK на срочность
	C_name        string         // название
	C_description sql.NullString // описание
	C_plan_time   string         // планируемое время выполнения
	C_fact_time   string         // фактическое время выполнения
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *TaskDBType) ToType() (e *entities.Task, err error) {
	e = new(entities.Task)

	e.ID = dbt.Pk_id
	e.PerformerID = dbt.Fk_performer.Int64
	e.ProjectID = dbt.Fk_project
	e.Status = dbt.Fk_status
	e.Urgently = dbt.Fk_urgently
	e.Name = dbt.C_name
	e.Description = dbt.C_description.String
	e.PlanTime = dbt.C_plan_time
	e.FactTime = dbt.C_fact_time

	return
}

// FromType функция преобразования типа сущности к типу бд
// допускается, что dbt is nil
func (_ *TaskDBType) FromType(e entities.Task) (dbt *TaskDBType, err error) {
	dbt = &TaskDBType{

		Pk_id:         e.ID,
		Fk_performer:  sql.NullInt64{e.PerformerID, true},
		Fk_project:    e.ProjectID,
		Fk_status:     e.Status,
		Fk_urgently:   e.Urgently,
		C_name:        e.Name,
		C_description: sql.NullString{e.Description, true},
		C_plan_time:   e.PlanTime,
		C_fact_time:   e.FactTime,
	}

	return
}

// MProject маппер проектов
type MTask struct {
	db *sql.DB
}

// Init
func (m *MTask) Init(db *sql.DB) {
	m.db = db
}

// SelectByProjectId получение задач по ID проекта
func (m *MTask) SelectByProjectId(id int64) (tasks []*TaskDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			fk_performer,
			fk_project,
			fk_status,
			fk_urgently,
			c_name,
			c_description,
			c_plan_time,
			c_fact_time
		FROM taskmaster.t_tasks
		WHERE fk_project = $1
		ORDER BY pk_id;
		`

	// выполнение запроса
	rows, err = m.db.Query(query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.SelectByProjectId : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		e := new(TaskDBType)

		// считывание строки выборки
		err = rows.Scan(
			&e.Pk_id,         // pk_id
			&e.Fk_performer,  // fk_performer
			&e.Fk_project,    // fk_project
			&e.Fk_status,     // fk_status
			&e.Fk_urgently,   // fk_urgently
			&e.C_name,        // c_name
			&e.C_description, // c_description
			&e.C_plan_time,   // c_plan_name
			&e.C_fact_time,   // c_fact_time
		)
		if err != nil {
			revel.AppLog.Errorf("MTask.SelectByProjectId : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		tasks = append(tasks, e)
	}

	return
}

// SelectByID получение задачи по ID
func (m *MTask) SelectByID(id int64) (e *TaskDBType, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	e = new(TaskDBType)

	// запрос
	query = `
		SELECT
			pk_id,
			fk_performer,
			fk_project,
			fk_status,
			fk_urgently,
			c_name,
			c_description,
			c_plan_time,
			c_fact_time
		FROM taskmaster.t_tasks
		WHERE pk_id = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(
		&e.Pk_id,         // pk_id
		&e.Fk_performer,  // fk_performer
		&e.Fk_project,    // fk_project
		&e.Fk_status,     // fk_status
		&e.Fk_urgently,   // fk_urgently
		&e.C_name,        // c_name
		&e.C_description, // c_description
		&e.C_plan_time,   // c_plan_name
		&e.C_fact_time,   // c_fact_time
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.SelectByID : row.Scan, %s\n", err)
		return
	}

	return
}

// Insert добавление задачи
func (m *MTask) Insert(edbt *TaskDBType) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	if edbt.Fk_performer.Int64 == 0 {
		fmt.Printf("\n\nUBRA: %v\n\n", "YES")
		// запрос
		query = `
		INSERT INTO taskmaster.t_tasks(
			fk_project,
			fk_status,
			fk_urgently,
			c_name,
			c_description,
			c_plan_time,
			c_fact_time
		)
		VALUES(
			$1,	-- fk_project,
			$2,	-- fk_status,
			$3,	-- fk_urgently,
			$4,	-- c_name,
			$5,	-- c_description,
			$6,	-- c_plan_time,
			$7	-- c_fact_time
		)
		returning pk_id;
		`

		// выполнение запроса
		row = m.db.QueryRow(query,
			edbt.Fk_project,    // fk_project
			edbt.Fk_status,     // fk_status
			edbt.Fk_urgently,   // fk_urgently
			edbt.C_name,        // c_name
			edbt.C_description, // c_description
			edbt.C_plan_time,   // c_plan_name
			edbt.C_fact_time,   // c_fact_time
		)
	}

	if edbt.Fk_performer.Int64 != 0 {
		// запрос
		query = `
			INSERT INTO taskmaster.t_tasks(
				fk_performer,
				fk_project,
				fk_status,
				fk_urgently,
				c_name,
				c_description,
				c_plan_time,
				c_fact_time
			)
			VALUES(
				$1,	-- fk_performer,
				$2,	-- fk_project,
				$3,	-- fk_status,
				$4,	-- fk_urgently,
				$5,	-- c_name,
				$6,	-- c_description,
				$7,	-- c_plan_time,
				$8	-- c_fact_time
			)
			returning pk_id;
		`

		// выполнение запроса
		row = m.db.QueryRow(query,
			edbt.Fk_performer,  // fk_performer
			edbt.Fk_project,    // fk_project
			edbt.Fk_status,     // fk_status
			edbt.Fk_urgently,   // fk_urgently
			edbt.C_name,        // c_name
			edbt.C_description, // c_description
			edbt.C_plan_time,   // c_plan_name
			edbt.C_fact_time,   // c_fact_time
		)
	}

	// считывание id
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.Insert : row.Scan, %s\n", err)
		return
	}

	return
}

// Update изменение задачи
func (m *MTask) Update(edbt *TaskDBType) (err error) {
	var (
		query string // строка запроса
	)

	if edbt.Fk_performer.Int64 == 0 {
		// запрос
		query = `
			UPDATE taskmaster.t_tasks
			SET 
				fk_performer = null,
				fk_project = $2,
				fk_status = $3,
				fk_urgently = $4,
				c_name = $5,
				c_description = $6,
				c_plan_time = $7,
				c_fact_time = $8
			WHERE pk_id = $1;
		`
		// выполнение запроса
		_, err = m.db.Exec(query,
			edbt.Pk_id,         // pk_id
			edbt.Fk_project,    // fk_project
			edbt.Fk_status,     // fk_status
			edbt.Fk_urgently,   // fk_urgently
			edbt.C_name,        // c_name
			edbt.C_description, // c_description
			edbt.C_plan_time,   // c_plan_name
			edbt.C_fact_time,   // c_fact_time
		)
	}

	if edbt.Fk_performer.Int64 != 0 {

		// запрос
		query = `
			UPDATE taskmaster.t_tasks
			SET 
				fk_performer = $2,
				fk_project = $3,
				fk_status = $4,
				fk_urgently = $5,
				c_name = $6,
				c_description = $7,
				c_plan_time = $8,
				c_fact_time = $9
			WHERE pk_id = $1;
		`

		// выполнение запроса
		_, err = m.db.Exec(query,
			edbt.Pk_id,         // pk_id
			edbt.Fk_performer,  // fk_performer
			edbt.Fk_project,    // fk_project
			edbt.Fk_status,     // fk_status
			edbt.Fk_urgently,   // fk_urgently
			edbt.C_name,        // c_name
			edbt.C_description, // c_description
			edbt.C_plan_time,   // c_plan_name
			edbt.C_fact_time,   // c_fact_time
		)
	}

	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.Update : m.db.Exec, %s\n", err)
		return
	}

	return
}

// Delete удаление проекта
func (m *MTask) Delete(edbt *TaskDBType) (err error) {
	var (
		query string // строка запроса
	)

	// запрос
	query = `
		DELETE FROM taskmaster.t_tasks
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query, edbt.Pk_id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MTask.Delete : m.db.Exec, %s\n", err)
		return
	}

	return
}
