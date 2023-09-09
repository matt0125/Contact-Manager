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

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const result = await login(username, password);
    if (result.success) {
        console.log('Successfully logged in with token:', result.token);
    } else {
        console.error('Login failed:', result.error);
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

    const result = await signup(firstname, lastname, username, password);
    if (result.success) {
        console.log('Successfully signed up with token:', result.token);
    } else {
        console.error('Sign up failed:', result.error);
    }
});