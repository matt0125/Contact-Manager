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

            var raw = JSON.stringify({
            "login": username,
            "password": password
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

const errorMsg = document.getElementById('errorMsg');

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const result = await login(username, password);
    if (result.success) {
        console.log('Successfully logged in');
        errorMsg.textContent = '';
        errorMsg.classList.remove('error-message');

        window.location.href = 'contact.html';
    } else {
        console.error('Login failed:', result.error);

        errorMsg.classList.add('error-message');
        if (result.error ===     "No Records Found") {
            errorMsg.textContent = "User name does not exist";
        } else if (result.error === "Incorrect password") {
            errorMsg.textContent = "User name exists, incorrect password";
        } else {
            errorMsg.textContent = "Unknown error occurred. Please try again.";
        }
    }
});

async function signup(firstname, lastname, username, password) {
    try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
            "firstname": firstname,
            "lastname": lastname,
            "login": username,
            "password": password
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

document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstname = document.getElementById('signUpFirstname').value;
    const lastname = document.getElementById('signUpLastname').value;
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const signUpError = document.getElementById("signUpError");

    if (password !== confirmPassword) {
        console.log("Passwords don't match");
        signUpError.classList.add('error-message');
        signUpError.textContent = "Passwords do not match. Please try again.";
        return;
    }

    const result = await signup(firstname, lastname, username, password);
    if (result.success) {
        errorMsg.textContent = "Succesfully signed up. Please log in.";
        console.log('Successfully signed up');
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