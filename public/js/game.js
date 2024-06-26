addEventListener("DOMContentLoaded", (event) => {
    let buffer = document.querySelector(".buffer__figure");
    let nextFifures = document.querySelectorAll(".figure");
    let arrAll = ['../images/orange.png', '../images/green.png', '../images/figure.png', '../images/fiol.png', '../images/detail.png','../images/orange.png', '../images/orange.png', '../images/green.png', '../images/figure.png', '../images/fiol.png', '../images/detail.png','../images/orange.png', '../images/orange.png', '../images/green.png', '../images/figure.png', '../images/fiol.png', '../images/detail.png','../images/orange.png'];
    let i = 0;
    buffer.src = "../images/figure.png";
    for (let j = 0; j < 4; j++) {
        nextFifures[j].src = arrAll[i];
        i++;
      }
    document.addEventListener('click', (e)=>{
        for (let j = 0; j < 3; j++) {
            nextFifures[j].src = nextFifures[j + 1].src;
          }
        nextFifures[3].src = arrAll[i];
        i++
    })
});