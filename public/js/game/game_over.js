addEventListener("DOMContentLoaded", () => {
    document.getElementById("link__back").addEventListener("click", () => back())
})

function back(){
    switch (localStorage.mode) {
        case '0': window.location.href = '/game'; break;
        case '1': window.location.href = '/blitz'; break;
        case '2': window.location.href = '/l40'; break;
        case '3': window.location.href = '/bot'; break;
        case '3': window.location.href = '/koop'; break;
        default: window.location.href = '/game'; break;
      }
}