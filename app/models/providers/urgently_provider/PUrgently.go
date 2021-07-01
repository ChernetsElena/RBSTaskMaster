package urgently_provider

import (
	"database/sql"
	"taskmaster/app/helpers"
	"taskmaster/app/models/entities"
	"taskmaster/app/models/mappers"

	"github.com/revel/revel"
)

// PUrgently провайдер контроллера срочности
type PUrgently struct {
	urgentlyMapper *mappers.MUrgently
}

// Init
func (p *PUrgently) Init() (err error) {
	var db *sql.DB // экземпляр подключения к бд

	// получение экземпляра подключения к бд
	db, err = helpers.GetDBConnection()
	if err != nil {
		revel.AppLog.Errorf("PUrgently.Init : helpers.GetDBConnection, %s\n", err)
		return err
	}

	// инициализация маппера срочности
	p.urgentlyMapper = new(mappers.MUrgently)
	p.urgentlyMapper.Init(db)

	return
}

// GetUrgently метод получения срочности
func (p *PUrgently) GetUrgently() (ps []*entities.Urgently, err error) {
	var (
		pdbts []*mappers.UrgentlyDBType
		pos   *entities.Urgently
	)

	// получение данных срочности
	pdbts, err = p.urgentlyMapper.SelectAll()
	if err != nil {
		revel.AppLog.Errorf("PUrgently.GetUrgently : p.urgentlyMapper.SelectAll, %s\n", err)
		return
	}

	for _, pdbt := range pdbts {
		// преобразование к типу сущности
		pos, err = pdbt.ToType()
		if err != nil {
			revel.AppLog.Errorf("PUrgently.GetUrgently : pdbt.ToType, %s\n", err)
			return
		}

		ps = append(ps, pos)
	}

	return
}
