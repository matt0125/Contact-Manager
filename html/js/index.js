function toggleForm(formToShow) {
    const loginForm = document.getElementById("loginForm");
    const signUpForm = document.getElementById("signUpForm");
    const loginButton = document.getElementById("loginButton");
    const signUpButton = document.getElementById("signUpButton");

    if (formToShow === 'login') {
        loginForm.style.display = "block";
        signUpForm.style.display = "none";
        loginButton.classList.add("btn-primary");
        loginButton.classList.remove("btn-secondary");
        signUpButton.classList.add("btn-secondary");
        signUpButton.classList.remove("btn-primary");
    } else {
        loginForm.style.display = "none";
        signUpForm.style.display = "block";
        signUpButton.classList.add("btn-primary");
        signUpButton.classList.remove("btn-secondary");
        loginButton.classList.add("btn-secondary");
        loginButton.classList.remove("btn-primary");
    }
}

async function login(username, password) {
    try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            var hashUser = md5(user);
            var hash = md5(password);
            
            var raw = JSON.stringify({
            "login": hashUser,
            "password": hash
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            
        const response = await fetch('http://poosd-project.com/LAMPAPI/Login.php', requestOptions);

        const data = await response.json();
        if (data.id !== 0) {
            let date = new Date();
            date.setTime(date.getTime()+(20*60*1000));	
            document.cookie = "userId=" + data.id + ";expires=" + date.toGMTString();
            document.cookie = "firstName=" + data.firstName + ";expires=" + date.toGMTString();
            document.cookie = "lastName=" + data.lastName + ";expires=" + date.toGMTString();
            document.cookie = "expiration=" + date.toGMTString();

            return {
                success: true,
                userId: data.id,
                firstName: data.firstName,
                lastName: data.lastName
            };
        } else {
            return {
                success: false,
                error: data.error
            };
        }
    } catch (error) {
        console.error("There was an issue with the fetch operation:", error.message);
        return {
            success: false,
            error: 'Network or server error'
        };
    }
}

function setErrorHighlight(element, hasError){
    if(hasError) {
        element.classList.add('error-highlight');
    } else {
        element.classList.remove('error-highlight');
    }
}

const errorMsg = document.getElementById('errorMsg');

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    document.getElementById('loginUsernameErr').textContent = '';
    document.getElementById('loginPasswordErr').textContent = '';
    setErrorHighlight(document.getElementById('loginUsername'), false);
    setErrorHighlight(document.getElementById('loginPassword'), false);

    if(username.trim() === ''){
        document.getElementById('loginUsernameErr').textContent = 'Please enter username';
        setErrorHighlight(document.getElementById('loginUsername'), true);
    }

    if(password.trim() === ''){
        document.getElementById('loginPasswordErr').textContent = 'Please enter password';
        setErrorHighlight(document.getElementById('loginPassword'), true);
    }

    if(username.trim() === ''||password.trim() === ''){
        return;
    }

    const result = await login(username, password);
    if (result.success) {
        console.log('Successfully logged in');
        errorMsg.textContent = '';
        errorMsg.classList.remove('error-message');

        loginPasswordInput.classList.remove('error-highlight');

        window.location.href = 'contact.html';
    } else {
        console.error('Login failed:', result.error);

        errorMsg.classList.add('inputError');
        if (result.error ===     "No Records Found") {
            errorMsg.textContent = "User name does not exist";
            usernameInput.classList.add('error-highlight');
        } else if (result.error === "Incorrect password") {
            errorMsg.textContent = "User name exists, incorrect password";
            loginPasswordInput.classList.add('error-highlight');
        } else {
            errorMsg.textContent = "Unknown error occurred. Please try again.";
        }
    }
});

async function signup(firstname, lastname, username, password) {
    try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var hash = md5(password);
            var hashUser = md5(username);

            var raw = JSON.stringify({
            "firstname": firstname,
            "lastname": lastname,
            "login": hashUser,
            "password": hash
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            
        const response = await fetch('http://poosd-project.com/LAMPAPI/Register.php', requestOptions);

        const data = await response.json();
        if (data.id !== 0) {
            return {
                success: true,
                userId: data.id,
                firstName: data.firstName,
                lastName: data.lastName
            };
        } else {
            return {
                success: false,
                error: data.error
            };
        }
    } catch (error) {
        console.error("There was an issue with the fetch operation:", error.message);
        return {
            success: false,
            error: 'Network or server error'
        };
    }
}

const signupConfirmPasswordInput = document.getElementById("confirmPassword");

document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstname = document.getElementById('signUpFirstname').value;
    const lastname = document.getElementById('signUpLastname').value;
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const signUpError = document.getElementById("signUpError");

    document.getElementById('signupFirstNameErr').textContent = '';
    document.getElementById('signupLastNameErr').textContent = '';
    document.getElementById('signupUsernameErr').textContent = '';
    document.getElementById('signupPasswordErr').textContent = '';
    document.getElementById('signupConfirmPassErr').textContent = '';
    setErrorHighlight(document.getElementById('signUpFirstname'), false);
    setErrorHighlight(document.getElementById('signUpLastname'), false);
    setErrorHighlight(document.getElementById('signUpUsername'), false);
    setErrorHighlight(document.getElementById('signUpPassword'), false);
    setErrorHighlight(document.getElementById('confirmPassword'), false);

    if(firstname.trim() === ''){
        document.getElementById('signupFirstNameErr').textContent = 'Please enter first name';
        setErrorHighlight(document.getElementById('signUpFirstname'), true);
    }
    if(lastname.trim() === ''){
        document.getElementById('signupLastNameErr').textContent = 'Please enter last name';
        setErrorHighlight(document.getElementById('signUpLastname'), true);
    }
    if(username.trim() === ''){
        document.getElementById('signupUsernameErr').textContent = 'Please enter username'
        setErrorHighlight(document.getElementById('signUpUsername'), true);
    }
    if(password.trim() === ''){
        document.getElementById('signupPasswordErr').textContent = 'Please enter password'
        setErrorHighlight(document.getElementById('signUpPassword'), true);
    }
    if(confirmPassword.trim() === ''){
        document.getElementById('signupConfirmPassErr').textContent = 'Please enter password to confirm'
        setErrorHighlight(document.getElementById('confirmPassword'), true);
    }

    if(firstname.trim() === ''||lastname.trim() === ''||username.trim() === ''||password.trim() === ''||confirmPassword.trim() === ''){
        return;
    }
    

    if (password !== confirmPassword) {
        console.log("Passwords don't match");
        signUpError.classList.add('error-message');
        signUpError.textContent = "Passwords do not match. Please try again.";

        signupPasswordInput.classList.add('error-highlight');
        signupConfirmPasswordInput.classList.add('error-highlight');
        return;
    }

    const result = await signup(firstname, lastname, username, password);
    if (result.success) {
        errorMsg.textContent = "Succesfully signed up. Please log in.";
        console.log('Successfully signed up');

        signupPasswordInput.classList.remove('error-highlight');
        signupConfirmPasswordInput.classList.remove('error-highlight');

        toggleForm('login');
    } else {
        console.error('Sign up failed:', result.error);
    }
});

// Returns value of associated cookie name. If Cookie name doesn't exist, returns null.
function readCookie(cookieName) {
    let cookieArray = document.cookie.split(';');

    for (let cookieString of cookieArray) {
        let [name, value] = cookieString.trim().split('=');
        if (name === cookieName) {
            return value;
        }
    }
    return null;
}

// Automatically login
window.onload = function() {
    let userId = readCookie("userId");
    let firstName = readCookie("firstName");
    let lastName = readCookie("lastName");

    if (userId && firstName && lastName) {
        window.location.href = 'contact.html';
    }
}

// password hide/show functionality (LOGIN)
const loginPasswordInput = document.getElementById("loginPassword");
const loginToggleIcon = document.getElementById("loginToggleIcon");
const signupPasswordInput = document.getElementById("signUpPassword");
const signupToggleIcon = document.getElementById("toggleIcon");
const signupConfirmPassInput = document.getElementById("confirmPassword");
const signupConfirmPassIcon = document.getElementById("suConfirmToggleIcon");

const usernameInput = document.getElementById("loginUsername");

function togglePasswordVisibility(passwordInput, toggleIcon) {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

document.getElementById("togglePassword").addEventListener("click", () => {
  togglePasswordVisibility(signupPasswordInput, signupToggleIcon);
});

document.getElementById("toggleConfirmPassword").addEventListener("click", () => {
    togglePasswordVisibility(signupConfirmPassInput, signupConfirmPassIcon);
});

document.getElementById("loginTogglePassword").addEventListener("click", () => {
  togglePasswordVisibility(loginPasswordInput, loginToggleIcon);
});
