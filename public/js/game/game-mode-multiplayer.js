window.addEventListener("DOMContentLoaded", () => {
  localStorage.mode = 'm';
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
      window.location.href = '/multiplayer'
    })
  })
});