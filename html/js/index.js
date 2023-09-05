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
