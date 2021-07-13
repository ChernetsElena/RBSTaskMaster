package mappers

import (
	"database/sql"
	"taskmaster/app/models/entities"

	"github.com/revel/revel"
)

// PositionDBType тип сущности "должность" бд
type PositionDBType struct {
	Pk_id  int64  // идентификатор
	C_name string // название должности
}

// ToType функция преобразования типа бд к типу сущности
func (dbt *PositionDBType) ToType() (p *entities.Position, err error) {
	p = new(entities.Position)

	p.ID = dbt.Pk_id
	p.Name = dbt.C_name

	return
}

// MPosition маппер должностей
type MPosition struct {
	db *sql.DB
}

// Init
func InitPosition(db *sql.DB) *MPosition {
	return &MPosition{
		db: db,
	}
}

// SelectAll получение всех должностей
func (m *MPosition) SelectAll() (pdbts []*PositionDBType, err error) {
	var (
		query string    // строка запроса
		rows  *sql.Rows // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id,
			c_value
		FROM taskmaster.ref_positions
		ORDER BY pk_id;	
	`

	// выполнение запроса
	rows, err = m.db.Query(query)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MPosition.SelectAll : m.db.query, %s\n", err)
		return
	}

	// обработка строк выборки
	for rows.Next() {
		// создание экземпляра сущности для считывания строки выборки
		pdbt := new(PositionDBType)

		// считывание строки выборки
		err = rows.Scan(&pdbt.Pk_id, &pdbt.C_name)
		if err != nil {
			revel.AppLog.Errorf("MPosition.SelectAll : rows.Scan, %s\n", err)
			continue
		}

		// добавление сущности в массив
		pdbts = append(pdbts, pdbt)
	}

	return
}

// PositionNameByID получение должности по id
func (m *MPosition) PositionNameByID(id int64) (positionName string, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		SELECT
			c_value
		FROM taskmaster.ref_positions
		WHERE pk_id = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, id)

	// считывание строки выборки
	err = row.Scan(&positionName)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MPosition.PositionNameByID : row.Scan, %s\n", err)
		return
	}

	return
}

// PositionNameByID получение id должности по названию
func (m *MPosition) IDByPositionName(positionName string) (id int64, err error) {
	var (
		query string   // строка запроса
		row   *sql.Row // выборка данных
	)

	// запрос
	query = `
		SELECT
			pk_id
		FROM taskmaster.ref_positions
		WHERE c_value = $1
		ORDER BY pk_id;
	`

	// выполнение запроса
	row = m.db.QueryRow(query, positionName)

	// считывание строки выборки
	err = row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			return
		}

		revel.AppLog.Errorf("MPosition.IDByPositionName : row.Scan, %s\n", err)
		return
	}

	return
}
