document.querySelector(".LogIn").addEventListener("click", () => Validation());

function Validation()
{
    const usernameInput = document.querySelector('.login-input__username-input').value;
    const passwordInput = document.querySelector('.login-input__password-input').value;
    const element = document.querySelector('.login-input__username-input');
    const password = document.querySelector('.login-input__password-input');
    const passError = document.querySelector('.login-input__password-validation');
    const usernameError = document.querySelector('.login-input__username-validation');
    const usernameRequire = document.querySelector('.login-input__username-require');
    const passwordRequire = document.querySelector('.login-input__password-require');
    const username = element.value;



    if (usernameInput === '')
    {
        usernameError.style.display = 'none';
        usernameRequire.style.display = 'flex';
        usernameRequire.style.marginBottom = '10px';
        element.style.marginBottom = '5px';
    }
    else
    {
        usernameRequire.style.display = 'none';
        if (validateUsername(username))
        {
            usernameError.style.display = 'none';
            element.style.marginBottom = '10px';
        } 
        else 
        {
            usernameError.style.display = 'flex';
            usernameError.style.marginBottom = '10px';
            element.style.marginBottom = '5px';
        }
    }

    if (passwordInput === '')
    {
        passError.style.display = 'none';
        passwordRequire.style.display = 'flex';
        passwordRequire.style.marginBottom = '10px';
        password.style.marginBottom = '5px';
    }
    else
    {
        passwordRequire.style.display = 'none'; 
        if ((passwordInput.length > 8)) 
        {
            passError.style.display = 'none';
            password.style.marginBottom = '10px';
        } 
        else 
        {
            passError.style.display = 'flex';
            passError.style.marginBottom = '10px';
            password.style.marginBottom = '5px';
        }
    }
    
    function validateUsername(username) 
    {
        const re = /^[а-яА-Я0-9_]+$/;
        return re.test(username);
    }
    
}