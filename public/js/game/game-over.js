window.addEventListener("DOMContentLoaded", () => {
  let arrMode = document.querySelector('.again');
  arrMode.addEventListener('click', () => {
      switch (localStorage.mode) {
        case '0': window.location.href = '/game'; break;
        case '1': window.location.href = '/blitz'; break;
        case '2': window.location.href = '/40l'; break;
        case '3': window.location.href = '/game'; break;
        default: window.location.href = '/game'; break;
      }
    })
});