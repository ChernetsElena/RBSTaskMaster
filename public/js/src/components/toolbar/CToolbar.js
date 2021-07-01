
import ToolbarView from './ToolbarView.js';

export class Toolbar {
    constructor(){
        this.view
        this.showEmployeeView
    }

    init(showEmployeeViewCB) {
        this.showEmployeeView = showEmployeeViewCB
    }

    config() {
        return ToolbarView()
    }

    attachEvents() {
        this.view = {
            toolbar: $$('toolbar'),
            userBtn: $$('toolbarUserButton'),
            employeesBtn: $$('toolbarEmployeesButton'),
            label: $$('toolbarLabel'),
            logoutBtn: $$('toolbarLogoutButton'),
        }

        this.view.employeesBtn.attachEvent("onItemClick", () => {
            this.showEmployeeView()
        })
    }
}
