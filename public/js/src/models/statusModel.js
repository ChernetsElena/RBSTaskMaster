import Model from '../../helpers/model.js';

/// PositionModel объект для работы(CRUD) с данными
class StatusModel extends Model {
    constructor() {
        super()
    }

    // получение должностей
    getStatuses() {
        return this.get('/status/all')
    }
}
const statusModel = new StatusModel();
export default statusModel