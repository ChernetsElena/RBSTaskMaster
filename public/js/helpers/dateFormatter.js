// функция преобразует строку в дату
export function FormatDate(date) {
    date = new Date(date)
    return (date)
}

// функция извлекает из ддаты время и преобразует его в строку
export function FormatTime(date) {
    if (date == undefined || date == "Invalid Date" || date == ""){
        date = '00:00:00'
    }
    else {
        date = date.toString()
        let doublePoint = date.indexOf(':')
        
        date = date.substr(0, doublePoint + 6)
        date = date.substr(doublePoint-2, date.length)  
    }
    return (date)
}

// функция преобразует строку со временем в дату
export function StringToDate(str) {
    let date = new Date(str.substr(0, str.length-1))
    return (date)
}