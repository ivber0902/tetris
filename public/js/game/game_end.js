const host = window.location.hostname;

function gameEnd(score) {
    localStorage.Gamewidth = 10;
    localStorage.Gameheight = 20;
    sendResult(score).then(() => { });
}

async function sendResult(score) {
    let response = await fetch("api/game/single/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            score
        )
    });
    if (score.is_won) {
        window.location.href = '/game_over'
    } else {
        window.location.href = "/game_over_mode";
    }
}
