let playerId = document.querySelector('.player_id').value
console.log(playerId)

async function foundLeaders(sortKey, count, mode)
{
    let response = await fetch(`/api/game/rating?sortKey=${sortKey}&count=${count}&mode=${mode}`, {
        method: 'GET'
    });
    return await response.json();
}

foundLeaders('maxScore', 1, 1).then((results) => {
    console.log(results) 
})