const urlParams = new URLSearchParams(window.location.search);
const reason = urlParams.get("reason");
if(reason){
    alert("Вы были отключены от сервера")
}