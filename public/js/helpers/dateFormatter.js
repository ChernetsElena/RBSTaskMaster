
const monthName = {
    0: "января",
    1: "февраля",
    2: "марта",
    3: "апреля",
    4: "мая",
    5: "июня",
    6: "июля",
    7: "августа",
    8: "сентября",
    9: "октября",
    10: "ноября",
    11: "декабря"
}


export function FormatDate(date) {
    date = new Date(date)
    //let month = date.getMonth()
    //let format = webix.Date.dateToStr(`%d ${monthName[month]} %Y`)
    //return format(date)
    return (date)
}

export function BirthToDate(date) {
    let dateArr = date.split(' ');
    let monthArr = Object.values(monthName)
    let month = monthArr.indexOf(dateArr[1])
    if (month < 10) {
        month = '0' + month
    }
    let dateFromBirth = dateArr[2] + '-' + month + '-' + dateArr[0]
    dateFromBirth = new Date(dateFromBirth)
    return dateFromBirth
}

