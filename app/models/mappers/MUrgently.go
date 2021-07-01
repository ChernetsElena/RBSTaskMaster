package mappers

import (
	"database/sql"
	"taskmaster/app/models/entities"

	"github.com/revel/revel"
)

// UrgentlyDBType тип сущности "статус" бд
type UrgentlyDBType struct {
	Pk_id  int64  // идентификатор
	C_name string // название
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *UrgentlyDBType) ToType() (e *entities.Urgently, err error) {
	e = new(entities.Urgently)

	e.ID = dbt.Pk_id
	e.Name = dbt.C_name
	return
}

// FromType функция преобразования типа сущности к типу бд
// допускается, что dbt is nil
func (_ *UrgentlyDBType) FromType(e entities.Urgently) (dbt *UrgentlyDBType, err error) {
	dbt = &UrgentlyDBType{

		Pk_id:  e.ID,
		C_name: e.Name,
	}

	return
}

// MUrgently маппер срочностей
type MUrgently struct {
	db *sql.DB
}

// Init
func (m *MUrgently) Init(db *sql.DB) {
	m.db = db
}

// SelectAll получение всех срочностей
func (m *MUrgently) SelectAll() (urgently []*UrgentlyDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			c_value
		FROM taskmaster.ref_urgently
		ORDER BY pk_id;
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MUrgently.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		e := new(UrgentlyDBType)

		// считывание строки выборки
		err = rows.Scan(
			&e.Pk_id,  // pk_id
			&e.C_name, // c_value
		)
		if err != nil {
			revel.AppLog.Errorf("MUrgently.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		urgently = append(urgently, e)
	}

	return
}
