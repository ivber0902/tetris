async function foundLeaders(sortKey, count)
{
    let response = await fetch(`/api/game/rating?sortKey=${sortKey}&count=${count}`, {
        method: 'GET'
    });
    return await response.json();
}

foundLeaders('totalScore', 10)