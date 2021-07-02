
export function FormatDate(date) {
    date = new Date(date)
    return (date)
}

export function FormatTime(date) {
    if (date == undefined || date == "Invalid Date"){
        date = '00:00:00'
    }
    else {
        date = date.toString()
        date = date.substr(0, date.length-47)
        date = date.substr(16, date.length)
    }
    return (date)
}

export function StringToDate(str) {
    let date = new Date(str.substr(0, str.length-1))
    return (date)
}