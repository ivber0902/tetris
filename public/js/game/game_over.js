addEventListener("DOMContentLoaded", () => {
    document.getElementById("link__back").addEventListener("click", (e) => back(e))
})

function back(){
    window.history.back()
}