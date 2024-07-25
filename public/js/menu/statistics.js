let playerId = document.querySelector('.player_id').value
console.log(playerId)

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

foundMode('maxScore', 1, 1).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.blitz__max-score').textContent = 'максимальное количество очков: ' + maxScore
})

foundTotal(1).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.blitz__total-score').textContent = 'суммарное количество очков: ' + totalScore
    document.querySelector('.blitz__game-count').textContent = 'количество игр: ' + countGame
})

foundMode('maxScore', 1, 2).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.lines__max-score').textContent = 'максимальное количество очков: ' + maxScore
})

foundTotal(2).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.lines__total-score').textContent = 'суммарное количество очков: ' + totalScore
    document.querySelector('.lines__game-count').textContent = 'количество игр: ' + countGame
})

foundMode('maxScore', 1, 3).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.bot__max-score').textContent = 'максимальное количество очков: ' + maxScore
})

foundTotal(3).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.bot__total-score').textContent = 'суммарное количество очков: ' + totalScore
    document.querySelector('.bot__game-count').textContent = 'количество игр: ' + countGame
})

foundMode('maxScore', 1, 4).then((results) => {
    let maxScore = 0
    console.log(results, 'test')
    results.forEach(element => {
        maxScore = element.score
    });
    document.querySelector('.koop__max-score').textContent = 'максимальное количество очков: ' + maxScore
})

foundTotal(4).then((results) => {
    console.log(results) 
    let countGame = 0
    let totalScore = 0
    results.forEach(element => {
        countGame += 1
        totalScore += element.score
    });
    document.querySelector('.koop__total-score').textContent = 'суммарное количество очков: ' + totalScore
    document.querySelector('.koop__game-count').textContent = 'количество игр: ' + countGame
})