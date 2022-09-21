start()

tree.addEventListener('change', () => {
    const sorting = document.querySelector('.sorting')
    sorting.style.display = 'none'
    sorting.innerHTML = ''

    const pagination = document.querySelector('.pagination')
    pagination.innerHTML = ''

    startTree()
})

cards.addEventListener('change', () => {
    start()
})