import Model from '../../helpers/model.js';

// StatusModel объект для работы(CRUD) с данными
class StatusModel extends Model {
    constructor() {
        super()
    }

    // получение статусов
    getStatuses() {
        return this.get('/status/all')
    }
}
const statusModel = new StatusModel();
export default statusModel