const host = window.location.hostname;

function gameEnd(score) {
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
        if (score.mode === 1 || score.mode === 2){
            window.location.href = "/game_over_mode";
        }
        else{
            window.location.href = '/game_over'
        }
    }
}