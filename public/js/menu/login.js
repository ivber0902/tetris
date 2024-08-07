addEventListener("DOMContentLoaded", (event) => {
    document.querySelector(".login-button").addEventListener("click", (e) => Validation(e));
});


function Validation(e) {
    e.preventDefault();
    let successfull = true;
    const form = document.querySelector('.login-input');
    const usernameInput = document.querySelector('.login-input__username-input').value;
    const passwordInput = document.querySelector('.login-input__password-input').value;
    const element = document.querySelector('.login-input__username-input');
    const password = document.querySelector('.login-input__password-input');
    const usernameError = document.querySelector('.login-input__username-validation');
    const usernameRequire = document.querySelector('.login-input__username-require');
    const passwordRequire = document.querySelector('.login-input__password-require');
    const username = element.value;

    if (usernameInput === '') {
        successfull = false;
        usernameError.style.display = 'none';
        usernameRequire.style.display = 'flex';
        usernameRequire.style.marginBottom = '10px';
        element.style.marginBottom = '5px';
    }
    else {
        usernameRequire.style.display = 'none';
        if (validateUsername(username)) {
            usernameError.style.display = 'none';
            element.style.marginBottom = '10px';
        }
        else {
            successfull = false;
            usernameError.style.display = 'flex';
            usernameError.style.marginBottom = '10px';
            element.style.marginBottom = '5px';
        }
    }

    if (passwordInput === '') {
        successfull = false;
        passwordRequire.style.display = 'flex';
        passwordRequire.style.marginBottom = '10px';
        password.style.marginBottom = '5px';
    }
    else {
        passwordRequire.style.display = 'none';
    }
    if (successfull) {
        form.submit();
    }
    function validateUsername(username) {
        const re = /^[а-яА-Я0-9_]+$/;
        return re.test(username);
    }

}