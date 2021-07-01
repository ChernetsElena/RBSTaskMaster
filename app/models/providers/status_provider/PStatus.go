package status_provider

import (
	"database/sql"
	"taskmaster/app/helpers"
	"taskmaster/app/models/entities"
	"taskmaster/app/models/mappers"

	"github.com/revel/revel"
)

// PStatus провайдер контроллера статусов
type PStatus struct {
	statusMapper *mappers.MStatus
}

// Init
func (p *PStatus) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PStatus.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера статусов
	p.statusMapper = new(mappers.MStatus)
	p.statusMapper.Init(db)

	return
}

// GetStatuses метод получения статусов
func (p *PStatus) GetStatuses() (ps []*entities.Status, err error) {
	var (
		pdbts []*mappers.StatusDBType
		pos   *entities.Status
	)

	// получение данных должностей
	pdbts, err = p.statusMapper.SelectAll()
	if err != nil {
		revel.AppLog.Errorf("PStatus.GetPositions : p.statusMapper.SelectAll, %s\n", err)
		return
	}

	for _, pdbt := range pdbts {
		// преобразование к типу сущности
		pos, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PStatus.GetPositions : pdbt.ToType, %s\n", err)
			return
		}

		ps = append(ps, pos)
	}

	return
}
