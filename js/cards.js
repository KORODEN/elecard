let localCatalog = localStorage.getItem('cards') ? JSON.parse(localStorage.getItem('cards')) : []

//пагинация
const itemsOnPage = 20
let currentPage = 1

function createDrawCards() {
    const sorting = document.querySelector('.sorting')
    sorting.style.display = 'block'
    sorting.innerHTML = `
    <div class="sort">
        <div class="block">
            <label for="">По категории</label>
            <input type="radio" id="category" name="sort" checked>
        </div>
        <div class="block">
            <label for="">По дате</label>
            <input type="radio" id="date" name="sort">
        </div>
        <div class="block">
            <label for="">По названию</label>
            <input type="radio" id="name" name="sort">
        </div>
        <div class="block">
            <label for="">По размеру файла</label>
            <input type="radio" id="filesize" name="sort">
        </div>
    </div>
    <div class="buttons">
        <button class="increase">По возрастанию</button>
        <button class="decrease">По убыванию</button>
        <button class="clear">Очистить данные</button>
    </div>`
    let incDec = true
    let sorted = []

    const categoryRadio = document.querySelector('#category')
    const dateRadio = document.querySelector('#date')
    const nameRadio = document.querySelector('#name')
    const filesizeRadio = document.querySelector('#filesize')

    const increase = document.querySelector('.increase')
    const decrease = document.querySelector('.decrease')
    const clear = document.querySelector('.clear')

    clear.addEventListener('click', () => {
        localStorage.clear()
        localCatalog = []
        catalog.forEach((item) => {
            localCatalog.push({
                id: item.id,
                closed: false
            })
        })
        if (incDec)
            increase.click()
        else
            decrease.click()

    })

    function clearPagination() {
        currentPage = 1
        buttonsVisibility()
    }

    categoryRadio.addEventListener('change', () => {

        increase.addEventListener('click', () => {
            clearPagination()
            incDec = true
            sorted = [...catalog].sort((a, b) => a.category.localeCompare(b.category))
            drawCards(sorted)
        })

        decrease.addEventListener('click', () => {
            clearPagination()
            incDec = false
            sorted = [...catalog].sort((a, b) => b.category.localeCompare(a.category))
            drawCards(sorted)
        })

        increase.click()
    })

    dateRadio.addEventListener('change', () => {

        increase.addEventListener('click', () => {
            clearPagination()
            incDec = true
            sorted = [...catalog].sort((a, b) => a.timestamp - b.timestamp)
            drawCards(sorted)
        })

        decrease.addEventListener('click', () => {
            clearPagination()
            incDec = false
            sorted = [...catalog].sort((a, b) => b.timestamp - a.timestamp)
            drawCards(sorted)
        })

        increase.click()
    })

    nameRadio.addEventListener('change', () => {
        increase.addEventListener('click', () => {
            clearPagination()
            incDec = true
            sorted = [...catalog].sort((a, b) => {
                let newA = a.image.slice(a.image.indexOf('/'))
                let newB = b.image.slice(a.image.indexOf('/'))
                return newA.localeCompare(newB)
            })
            drawCards(sorted)
        })

        decrease.addEventListener('click', () => {
            clearPagination()
            incDec = false
            sorted = [...catalog].sort((a, b) => {
                let newA = a.image.slice(a.image.indexOf('/'))
                let newB = b.image.slice(a.image.indexOf('/'))
                return newB.localeCompare(newA)
            })
            drawCards(sorted)
        })

        increase.click()
    })

    filesizeRadio.addEventListener('change', () => {
        increase.addEventListener('click', () => {
            clearPagination()
            incDec = true
            sorted = [...catalog].sort((a, b) => a.filesize - b.filesize)
            drawCards(sorted)
        })

        decrease.addEventListener('click', () => {
            clearPagination()
            incDec = false
            sorted = [...catalog].sort((a, b) => b.filesize - a.filesize)
            drawCards(sorted)
        })

        increase.click()
    })

    //реализация пагинации
    const pagination = document.querySelector('.pagination')
    pagination.innerHTML = `
    <div class="buttons">
        <button class="pageDown" style="display: none;">Предыдущая</button>
        <button class="pageUp">Следующая</button>
    </div>`

    const pageDown = document.querySelector('.pageDown')
    const pageUp = document.querySelector('.pageUp')

    function buttonsVisibility() {
        if (currentPage == 1) {
            pageDown.style.display = "none"
        } else {
            pageDown.style.display = "block"
        }

        if (currentPage == pagesNumber()) {
            pageUp.style.display = "none"
        } else {
            pageUp.style.display = "block"
        }
    }

    function scroll() {
        document.querySelector('body').scrollIntoView({
            behavior: 'smooth'
        })
    }

    pageUp.addEventListener('click', () => {
        if (currentPage < pagesNumber()) {
            currentPage++
            scroll()
            drawCards(sorted)
            buttonsVisibility()
        }
    })

    pageDown.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--
            scroll()
            drawCards(sorted)
            buttonsVisibility()
        }
    })


    let event = new Event('change')
    categoryRadio.dispatchEvent(event)

}





function start() {
    container.innerHTML = '';
    const loader = document.querySelector('.lds-dual-ring')
    loader.style.display = 'inline-block'
    fetch(fileUrl)
        .then(data => data.json())
        .then(array => {
            let id = 0
            array.forEach((item) => {
                if (!localStorage.getItem('cards')) {
                    localCatalog.push({
                        id: id,
                        closed: false
                    })
                }

                item.id = id
                id++
            })

            if (!localStorage.getItem('cards')) {
                localStorage.cards = JSON.stringify(localCatalog)
            }
            catalog = array

            createDrawCards()
            loader.style.display = 'none'
        })
}

//отрисовка карточек с учётом пагинации
function drawCards(array) {
    container.innerHTML = '';

    if (currentPage < 1) currentPage = 1
    if (currentPage > pagesNumber()) currentPage = pagesNumber()

    for (let count = 0, i = (currentPage - 1) * itemsOnPage; count < itemsOnPage; i++) {
        if (i < array.length) {
            drawCard(array[i])
            count++
        }
    }

    checkCards()
}

function pagesNumber() {
    return Math.ceil(catalog.length / itemsOnPage);
}

function checkCards() {
    if (!document.querySelector('.card'))
        container.innerHTML = '<h2>Все карточки на этой странице удалены. Перейдите на следующую</h2>'
}

function drawCard(item) {
    if (!localCatalog[item.id].closed) {
        const card = document.createElement('div')
        card.classList.add('card')
        card.dataset.id = item.id

        const image = document.createElement('div')
        image.classList.add('image')
        image.style.backgroundImage = `url(${imagesUrl + item.image})`
        card.append(image)

        const timestamp = document.createElement('h2')
        timestamp.innerText = `${humanDate(item.timestamp)}`
        card.append(timestamp)

        const filesize = document.createElement('p')
        filesize.innerText = `${bytesToSize(item.filesize)}`
        card.append(filesize)

        const deleteBlock = document.createElement('div')
        deleteBlock.classList.add('delete')
        deleteBlock.innerHTML = `&times;`

        function deleteBlockHandler(event) {
            localCatalog[event.target.parentNode.dataset.id].closed = true
            localStorage.cards = JSON.stringify(localCatalog)
            event.target.parentNode.remove()

            checkCards()

            deleteBlock.removeEventListener('click', deleteBlockHandler)
        }

        deleteBlock.addEventListener('click', deleteBlockHandler)

        card.append(deleteBlock)

        container.append(card)
    }
}