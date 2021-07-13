import Model from '../../helpers/model.js';

// UrgentlyModel объект для работы(CRUD) с данными
class UrgentlyModel extends Model {
    constructor() {
        super()
    }

    // получение срочности
    getUrgently() {
        return this.get('/urgently/all')
    }
}
const urgentlyModel = new UrgentlyModel();
export default urgentlyModel