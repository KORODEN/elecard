function startTree() {
    container.innerHTML = ''
    const loader = document.querySelector('.lds-dual-ring')
    loader.style.display = 'inline-block'
    fetch(fileUrl)
        .then(data => data.json())
        .then(array => {
            catalog = array

            drawTree(catalog)
            loader.style.display = 'none'
        })
}

function drawTree(catalog) {
    const treeHTML = document.createElement('div')
    treeHTML.className = 'treeHTML'
    treeHTML.innerText = 'Categories'

    let topMass = []

    //создание первого уровня массива
    let set = new Set()
    catalog.forEach((item) => {
        item.name = item.image.slice(item.image.indexOf('/') + 1, item.image.lastIndexOf('-'))
        item.number = item.image.slice(item.image.lastIndexOf('-') + 1, item.image.indexOf('_'))
        set.add(item.category)
    })

    set.forEach((element) => {
        let mass = catalog.filter(elem => elem.category === element)
        topMass.push(mass)
    })

    //создание второго уровня массива
    topMass.forEach((category, index) => {
        let nameSet = new Set()

        category.forEach((item) => {
            nameSet.add(item.name)
        })

        let innerMass = []
        nameSet.forEach((nameItem) => {
            let namesMass = category.filter(elem => elem.name === nameItem)
            innerMass.push(namesMass)
        })
        topMass[index] = innerMass
    })


    topMass.forEach(category => {
        const block = document.createElement('div')
        const details = document.createElement('details')
        const summary = document.createElement('summary')
        summary.innerHTML = category[0][0].category
        details.append(summary)

        category.forEach((names) => {
            const blockInner = document.createElement('div')
            const detailsInner = document.createElement('details')
            const summaryInner = document.createElement('summary')
            summaryInner.innerHTML = names[0].name
            detailsInner.append(summaryInner)

            names.forEach((number) => {
                const blockInner1 = document.createElement('div')
                const detailsInner1 = document.createElement('details')
                const summaryInner1 = document.createElement('summary')
                summaryInner1.innerHTML = `${number.number}`
                detailsInner1.append(summaryInner1)


                const image = document.createElement('img')
                image.classList.add('smallImage')
                image.src = `${imagesUrl + number.image}`

                image.addEventListener('click', () => {
                    image.classList.toggle('smallImage')
                })

                detailsInner1.append(image)


                const timestamp = document.createElement('p')
                timestamp.innerText = `${humanDate(number.timestamp)}`
                detailsInner1.append(timestamp)

                const filesize = document.createElement('p')
                filesize.innerText = `${bytesToSize(number.filesize)}`
                detailsInner1.append(filesize)


                blockInner1.append(detailsInner1)
                detailsInner.append(blockInner1)
            })


            blockInner.append(detailsInner)
            details.append(blockInner)
        })

        block.append(details)
        treeHTML.append(block)
    })


    container.append(treeHTML)
}