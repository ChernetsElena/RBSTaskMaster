import { Application } from "./src/components/Application.js"

webix.ready(() => {
    webix.i18n.setLocale("ru-RU")
    webix.Date.startOnMonday = true;
    let app = new Application();
    app.init()
    webix.ui(app.config()).show()
    app.attachEvents()
})