let button = document.querySelector('.back');
let userImageInput = document.getElementById('image-input');
let userImageProfile = document.querySelector('.user-avatar')

button.addEventListener('click', ()=>{
    window.history.back();
})

userImageInput.addEventListener('change', (event)=>{
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.user-avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
        ChangeImage(file)
        console.log(file)
    }
})

async function ChangeImage(image) {
    let response = await fetch('/send/image', {
        method: 'POST',
        body: image
    });
    console.log(response)
}