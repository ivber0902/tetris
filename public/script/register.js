addEventListener("DOMContentLoaded", (event) => {
    document.querySelector(".Register").addEventListener("click", e => {
        e.preventDefault();
        Validation()}
    );

async function Validation()
{
    const usernameInput = document.querySelector('.login-input__username-input').value;
    const passwordInput = document.querySelector('.login-input__password-input').value;
    const passwordAgain = document.querySelector('.login-input__password-again').value;
    const element = document.querySelector('.login-input__username-input');
    const password = document.querySelector('.login-input__password-input');
    const again = document.querySelector('.login-input__password-again');
    const passError = document.querySelector('.login-input__password-validation');
    const usernameError = document.querySelector('.login-input__username-validation');
    const againError = document.querySelector('.login-input__again-validation');
    const usernameRequire = document.querySelector('.login-input__username-require');
    const usernameEmployment = document.querySelector('.login-input__username-employment');
    const passwordRequire = document.querySelector('.login-input__password-require');
    const againRequire = document.querySelector('.login-input__again-require');
    const againIdentical = document.querySelector('.login-input__again-identical');
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

    if (passwordAgain === '')
    {
        againError.style.display = 'none';
        againRequire.style.display = 'flex';
        againRequire.style.marginBottom = '10px';
        again.style.marginBottom = '5px';
        againIdentical.style.display = 'none';
    }
    else
    {
        againRequire.style.display = 'none'; 
        if ((passwordAgain.length > 8)) 
        {
            againError.style.display = 'none';
            if (passwordInput === passwordAgain)
            {
                againError.style.display = 'none';
                again.style.marginBottom = '10px';
                againIdentical.style.display = 'none'
            }
            else
            {
                againIdentical.style.display = 'flex';
                againIdentical.style.marginBottom = '10px';
                again.style.marginBottom = '5px';
            }
            
        } 
        else 
        {
            againIdentical.style.display = 'none';
            againError.style.display = 'flex';
            againError.style.marginBottom = '10px';
            again.style.marginBottom = '5px';
        }
    }

    if ((usernameInput !== '')&&(validateUsername(username))&&(passwordInput !== '')&&(passwordInput.length > 8)&&(passwordAgain !== '')&&(passwordAgain.length > 8)&&(passwordInput === passwordAgain))
    {
        const data = new URLSearchParams();
        for (const pair of new FormData(document.forms.register_user_input)) {
            data.append(pair[0], pair[1]);
        }
        console.log(data);
        let response = await fetch('/api/register', {
            method: 'POST',
            body: data
        });
        console.log(response)
        if (response.ok) {
            let json = await response.json();
            window.location.href = '/';
          } else {
            usernameEmployment.style.display = "flex";
          }
    }

    
    function validateUsername(username) 
    {
        const re = /^[а-яА-Я0-9_]+$/;
        return re.test(username);
    }
    
}
});

