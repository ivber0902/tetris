window.addEventListener("DOMContentLoaded", () => {
  let arrMode = document.querySelectorAll('.link');
  arrMode.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      localStorage.mode = index;
    })
  })
});