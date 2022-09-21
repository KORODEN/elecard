//ссылки на ресурсы
const imagesUrl = 'http://contest.elecard.ru/frontend_data/'
const fileUrl = 'http://contest.elecard.ru/frontend_data/catalog.json'

let catalog = []

//получение доступа до основных элементов
const container = document.querySelector('.container')
const cards = document.querySelector('#cards')
const tree = document.querySelector('#tree')


//вспомогательные функции для отображения

//преобразование размера файла в человекочитаемый формат
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

//timestamp в человекочитаемом формате
function humanDate(timestamp) {
    const date = new Date(timestamp)
    let dateDay = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let dateMonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)

    return `${dateDay + '.' + dateMonth + '.' + date.getFullYear()}`
}