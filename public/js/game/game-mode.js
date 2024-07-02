let gameModes = [
    {
        width: 10,
        height: 20,
        background: '/images/fields/multiplayer/standart.png',
    },
    {
        width: 15,
        height: 20,
        background: '/images/fields/multiplayer/medium.png',
    },
    {
        width: 20,
        height: 20,
        background: '/images/fields/multiplayer/large.png',
    },
];

window.addEventListener("DOMContentLoaded", () => {
    let menu = document.createElement("div");
    menu.classList.add("game-mode-menu");

    gameModes.forEach((btn) => {
        let btnNode = document.createElement("button");
        btnNode.classList.add("game-mode-menu__button");
        btnNode.textContent = `${btn.width}:${btn.height}`;
        btnNode.addEventListener('click', () => {
            GAME.width = btn.width;
            GAME.height = btn.height;
            

            player.updateSize(GAME);
            canvas.width = player.interface.field.width;
            canvas.height = player.interface.field.height;
            canvas.style.backgroundImage = `url(${btn.background})`
            
            menu.remove();
            document.querySelector(".wrapper-game").classList.add("started");

            GAME.init();
        })
        menu.appendChild(btnNode);
    });
    document.body.appendChild(menu);
});