addEventListener("DOMContentLoaded", (event) => {
    document.querySelector(".exit").addEventListener("click", (e) => close(e));
});

addEventListener("DOMContentLoaded", (event) => {
    document.querySelector(".profile__avatar").addEventListener("click", (e) => open(e));
});

function close(e)
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'none';
}

function open(e)
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'inline';
}