addEventListener("DOMContentLoaded", () => {
    document.querySelector(".exit").addEventListener("click", (e) => close(e));
    document.querySelector(".profile__avatar").addEventListener("click", (e) => open(e));
})

function close()
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'none';
}

function open()
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'inline';
}