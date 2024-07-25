addEventListener("DOMContentLoaded", () => {
    document.querySelector(".exit").addEventListener("click", (e) => close(e));
    document.querySelector(".profile").addEventListener("click", (e) => open(e));
})

let userLink = document.querySelector(`a[href="/signup"]`);
console.log(userLink)

function close()
{
    const profile = document.querySelector('.user-profile');
    profile.style.display = 'none';
}

function open()
{
    if(!userLink){
        const profile = document.querySelector('.user-profile');
        profile.style.display = 'inline';
    }
}