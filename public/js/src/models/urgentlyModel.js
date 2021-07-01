import Model from '../../helpers/model.js';

/// PositionModel объект для работы(CRUD) с данными
class UrgentlyModel extends Model {
    constructor() {
        super()
    }

    // получение должностей
    getUrgently() {
        return this.get('/urgently/all')
    }
}
const urgentlyModel = new UrgentlyModel();
export default urgentlyModel