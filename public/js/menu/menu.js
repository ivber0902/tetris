const urlParams = new URLSearchParams(window.location.search);
const reason = urlParams.get("reason");
if(reason){
    const url = new URL(window.location);
    url.searchParams.delete('reason');
    window.history.replaceState({}, '', url);
}
