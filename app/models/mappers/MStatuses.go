package mappers

import (
	"database/sql"
	"taskmaster/app/models/entities"

	"github.com/revel/revel"
)

// StatusDBType тип сущности "статус" бд
type StatusDBType struct {
	Pk_id  int64  // идентификатор
	C_name string // название
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *StatusDBType) ToType() (e *entities.Status, err error) {
	e = new(entities.Status)

	e.ID = dbt.Pk_id
	e.Name = dbt.C_name
	return
}

// FromType функция преобразования типа сущности к типу бд
// допускается, что dbt is nil
func (_ *StatusDBType) FromType(e entities.Status) (dbt *StatusDBType, err error) {
	dbt = &StatusDBType{

		Pk_id:  e.ID,
		C_name: e.Name,
	}

	return
}

// MProject маппер статусов
type MStatus struct {
	db *sql.DB
}

// Init
func (m *MStatus) Init(db *sql.DB) {
	m.db = db
}

// SelectAll получение всех статусов
func (m *MStatus) SelectAll() (statuses []*StatusDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			c_value
		FROM taskmaster.ref_statuses
		ORDER BY pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MStatus.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		e := new(StatusDBType)

		// считывание строки выборки
		err = rows.Scan(
			&e.Pk_id,  // pk_id
			&e.C_name, // c_value
		)
		if err != nil {
			revel.AppLog.Errorf("MStatus.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		statuses = append(statuses, e)
	}

	return
}
