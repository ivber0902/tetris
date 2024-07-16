window.addEventListener("DOMContentLoaded", () => {
  let arrMode = document.querySelectorAll('.link');
  arrMode.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      switch (index) {
        case 0:
          localStorage.Gamewidth = 7;
          localStorage.Gameheight = 22;
          break
        case 1:
          localStorage.Gamewidth = 10;
          localStorage.Gameheight = 20;
          break
        case 2:
          localStorage.Gamewidth = 15;
          localStorage.Gameheight = 20;
          break
        default:
          localStorage.Gamewidth = 10;
          localStorage.Gameheight = 20;
      }
      switch (localStorage.mode) {
        case '0': window.location.href = '/game'; break;
        case '1': window.location.href = '/blitz'; break;
        case '2': window.location.href = '/l40'; break;
        case '3': window.location.href = '/game'; break;
        default: window.location.href = '/game'; break;
      }

    })
  })
});