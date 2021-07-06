package mappers

import (
	"database/sql"
	"taskmaster/app/models/entities"
	"time"

	"github.com/revel/revel"
)

// EmployeeDBType тип сущности "сотрудник" бд
type EmployeeDBType struct {
	Pk_id        int64          // идентификатор
	Fk_position  int64          // FK на должность
	C_name       string         // имя
	C_lastname   string         // фамилия
	C_middlename sql.NullString // отчество
	C_email      string         // почтовый адрес
	C_birth      *time.Time     //день рождения
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *EmployeeDBType) ToType() (e *entities.Employee, err error) {
	e = new(entities.Employee)

	e.ID = dbt.Pk_id
	e.Name = dbt.C_name
	e.LastName = dbt.C_lastname
	e.MiddleName = dbt.C_middlename.String
	e.Email = dbt.C_email
	e.Birth = dbt.C_birth

	return
}

// FromType функция преобразования типа сущности к типу бд
// допускается, что dbt is nil
func (_ *EmployeeDBType) FromType(e entities.Employee) (dbt *EmployeeDBType, err error) {
	dbt = &EmployeeDBType{

		Pk_id:        e.ID,
		C_name:       e.Name,
		C_lastname:   e.LastName,
		C_middlename: sql.NullString{e.MiddleName, true},
		C_email:      e.Email,
		C_birth:      e.Birth,
	}

	return
}

// MEmployee маппер сотрудников
type MEmployee struct {
	db *sql.DB
}

// Init
func InitEmployee(db *sql.DB) *MEmployee {

	return &MEmployee{
		db: db,
	}

}

// SelectAll получение всех сотрудников
func (m *MEmployee) SelectAll() (employees []*EmployeeDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			fk_position,
			c_name,
			c_lastname,
			c_middlename,
			c_email,
			c_date_of_birth
		FROM "taskmaster".t_employees
		ORDER BY pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		e := new(EmployeeDBType)

		// считывание строки выборки
		err = rows.Scan(
			&e.Pk_id,        // pk_id
			&e.Fk_position,  // fk_position
			&e.C_name,       // c_firstname
			&e.C_lastname,   // c_lastname
			&e.C_middlename, // c_middlename
			&e.C_email,      // c_email
			&e.C_birth,      // c_birth
		)
		if err != nil {
			revel.AppLog.Errorf("MEmployee.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		employees = append(employees, e)
	}

	return
}

// SelectByID получение сотрудника по ID
func (m *MEmployee) SelectByID(id int64) (e *EmployeeDBType, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	e = new(EmployeeDBType)

	// запрос
	query = `
		SELECT
			pk_id,
			fk_position,
			c_name,
			c_lastname,
			c_middlename,
			c_email,
			c_date_of_birth
		FROM "taskmaster".t_employees
		WHERE pk_id = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(
		&e.Pk_id,        // pk_id
		&e.Fk_position,  // fk_position
		&e.C_name,       // c_firstname
		&e.C_lastname,   // c_lastname
		&e.C_middlename, // c_middlename
		&e.C_email,      // c_email
		&e.C_birth,      // c_birth
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.SelectByID : row.Scan, %s\n", err)
		return
	}

	return
}

// GetNameByID получение имени сотрудника по ID
func (m *MEmployee) GetNameByID(id int64) (name string, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		SELECT
			c_name
		FROM taskmaster.t_employees
		WHERE pk_id = $1;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(&name)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.GetNameByID : row.Scan, %s\n", err)
		return
	}

	return
}

// GetLastNameByID получение фамилии сотрудника по ID
func (m *MEmployee) GetLastNameByID(id int64) (name string, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		SELECT
			c_lastname
		FROM taskmaster.t_employees
		WHERE pk_id = $1;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(&name)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.GetLastNameByID : row.Scan, %s\n", err)
		return
	}

	return
}

// Insert добавление сотрудника
func (m *MEmployee) Insert(edbt *EmployeeDBType) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		INSERT INTO taskmaster.t_employees(
			fk_position,
			c_name,
			c_lastname,
			c_middlename,
			c_email,
			c_date_of_birth
		)
		VALUES(
			$1,	-- fk_position
			$2,	-- c_name
			$3,	-- c_lastname
			$4,	-- c_middlename
			$5,	-- c_email
			$6 -- c_birth
		)
		returning pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query,
		edbt.Fk_position,  // fk_position
		edbt.C_name,       // c_firstname
		edbt.C_lastname,   // c_lastname
		edbt.C_middlename, // c_middlename
		edbt.C_email,      // c_email
		edbt.C_birth,      // c_birth
	)

	// считывание id
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.Insert : row.Scan, %s\n", err)
		return
	}

	return
}

// Update изменение сотрудника
func (m *MEmployee) Update(edbt *EmployeeDBType) (err error) {
	var (
		query string // строка запроса
	)

	revel.AppLog.Debugf("MEmployee.Update, edbt: %+v\n", edbt)

	// запрос
	query = `
		UPDATE "taskmaster".t_employees
		SET 
			fk_position = $2,
			c_name = $3,
			c_lastname = $4,
			c_middlename = $5,
			c_email = $6,
			c_date_of_birth = $7
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query,
		edbt.Pk_id,        // pk_id
		edbt.Fk_position,  // fk_position
		edbt.C_name,       // c_firstname
		edbt.C_lastname,   // c_lastname
		edbt.C_middlename, // c_middlename
		edbt.C_email,      // c_email
		edbt.C_birth,      // c_birth
	)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.Update : m.db.Exec, %s\n", err)
		return
	}

	return
}

// Delete удаление сотрудника
func (m *MEmployee) Delete(edbt *EmployeeDBType) (err error) {

	// запрос на перенос задачи в колонку согласование, если удаляемый сотрудник является исполнителем
	// если удаляемый сотрудник также является тимлидом, данные не изменяются
	query := `
		UPDATE "taskmaster".t_tasks
		SET
			fk_performer = CASE WHEN (
				$1 IN (
					SELECT fk_teamlead 
					FROM "taskmaster".t_projects
					GROUP BY fk_teamlead)
				)
				THEN fk_performer
				ELSE null
				END,
			
			fk_status = CASE WHEN (
				$1 IN (
					SELECT fk_teamlead 
					FROM "taskmaster".t_projects
					GROUP BY fk_teamlead)
				)
				THEN fk_status
				ELSE 5
				END

		WHERE fk_performer = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query, edbt.Pk_id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.Delete : m.db.Exec t_tasks, %s\n", err)
		return
	}

	// запрос на удаление пользователя записи из таблицы t_users при удалении связанного с ней сотрудника
	query = `
		DELETE FROM taskmaster.t_users
		WHERE fk_employee = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query, edbt.Pk_id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.Delete : m.db.Exec t_users, %s\n", err)
		return
	}

	// запрос
	query = `
		DELETE FROM "taskmaster".t_employees
		WHERE pk_id = $1;
	`

	// выполнение запроса
	_, err = m.db.Exec(query, edbt.Pk_id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MEmployee.Delete : m.db.Exec, %s\n", err)
		return
	}

	return
}
