function gameEnd(score) {
    sendResult(score).then(() => {});
}

async function sendResult(score) {
    let response = await fetch('/api/statistics', {
        method: 'POST',
        body: JSON.stringify({
            score: score
        })
    });
    console.log(response);
    if (response.ok) {
        window.location.href = '/game_over'
    } else {
        window.location.href = "/game_over?score=" + score;
    }
}