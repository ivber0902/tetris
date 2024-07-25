let playerId = document.querySelector('.player_id').value
console.log(playerId)

let button = document.querySelector('.back');
button.addEventListener('click', ()=>{
    window.history.back();
})

async function foundMode(sortKey, count, mode)
{
    let response = await fetch(`/api/game/rating?sortKey=${sortKey}&count=${count}&mode=${mode}&playerId=${playerId}`, {
        method: 'GET'
    });
    return await response.json();
}

async function foundTotal( mode)
{
    let response = await fetch(`/api/game/rating?&mode=${mode}&playerId=${playerId}`, {
        method: 'GET'
    });
    return await response.json();
}

foundMode('score', 1, 0).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.classic__max-value').textContent = maxScore
})

foundTotal(0).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.classic__total-value').textContent = totalScore
    document.querySelector('.classic__game-value').textContent = countGame
})

foundMode('score', 1, 1).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.blitz__max-value').textContent = maxScore
})

foundTotal(1).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.blitz__total-value').textContent = totalScore
    document.querySelector('.blitz__game-value').textContent = countGame
})

foundMode('score', 1, 2).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.lines__max-value').textContent = maxScore
})

foundTotal(2).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.lines__total-value').textContent = totalScore
    document.querySelector('.lines__game-value').textContent = countGame
})

foundMode('score', 1, 3).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.bot__max-value').textContent = maxScore
})

foundTotal(3).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.bot__total-value').textContent = totalScore
    document.querySelector('.bot__game-value').textContent = countGame
})

foundMode('score', 1, 4).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.koop__max-value').textContent = maxScore
})

foundTotal(4).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.koop__total-value').textContent = totalScore
    document.querySelector('.koop__game-value').textContent = countGame
})