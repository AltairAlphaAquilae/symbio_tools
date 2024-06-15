const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}
const generateRandom = (items,max) => {
    const array = []
    const randomPicks = []

    for (let index = 1; index <= max; index++) {
        array.push(index)
    }

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * array.length)
        
        randomPicks.push(array[randomIndex])
        array.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    selectors.boardContainer.classList.remove('flipped')
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    const picks = generateRandom((dimensions * dimensions) / 2,50) 
    const items = shuffle([...picks, ...picks])

    for (let index = 0; index < (dimensions * dimensions); index++) {
        var elem = document.querySelector('.card-back'+( '00' + index ).slice( -2 ))
        elem.innerText=items[index]
        elem.style.background = 'url(./items/' + items[index] + '.png) round';
    }
//    const cards = `
//        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
//            ${items.map(item => `
//                <div class="card">
//                    <div class="card-front"></div>
//                    <div class="card-back${item}">${item}</div>
//                </div>
//            `).join('')}
//       </div>
//    `
//    const parser = new DOMParser().parseFromString(cards, 'text/html')
//    selectors.board.replaceWith(parser.querySelector('.board'))

    startGame()
}

const startGame = () => {
    state.gameStarted = true
    selectors.boardContainer.classList.remove('flipped')
    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time: ${state.totalTime/10} sec`
    }, 100)
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                SEASON2 will start at Jun 20th at 12:00 (JST)<br />
                    With <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime/10}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
        selectors.boardContainer.classList.remove('flipped')
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON') {
            location.reload(true)
        }
    })
}

generateGame()
attachEventListeners()