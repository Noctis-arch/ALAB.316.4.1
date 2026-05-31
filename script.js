const registrationForm = document.getElementById("registration");
const loginForm = document.getElementById("login");
const errorDisplay = document.getElementById("errorDisplay");

function showMessage(message, input, success = false) {
  errorDisplay.textContent = message;
  errorDisplay.style.display = "block";

  if (success) {
    errorDisplay.classList.add("success");
  } else {
    errorDisplay.classList.remove("success");
  }

  if (input) {
    input.focus();
  }
}

function hideMessage() {
  errorDisplay.textContent = "";
  errorDisplay.style.display = "none";
  errorDisplay.classList.remove("success");
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function hasTwoUniqueCharacters(username) {
  return new Set(username.toLowerCase()).size >= 2;
}

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const usernameInput = registrationForm.username;
  const emailInput = registrationForm.email;
  const passwordInput = registrationForm.password;
  const passwordCheckInput = registrationForm.passwordCheck;
  const termsInput = registrationForm.terms;

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const passwordCheck = passwordCheckInput.value;

  const lowercaseUsername = username.toLowerCase();
  const lowercaseEmail = email.toLowerCase();

  const users = getUsers();

  if (username === "") {
    showMessage("The username cannot be blank.", usernameInput);
    return;
  }

  if (username.length < 4) {
    showMessage("The username must be at least four characters long.", usernameInput);
    return;
  }

  if (!hasTwoUniqueCharacters(username)) {
    showMessage("The username must contain at least two unique characters.", usernameInput);
    return;
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    showMessage("The username cannot contain any special characters or whitespace.", usernameInput);
    return;
  }

  if (users.some(user => user.username === lowercaseUsername)) {
    showMessage("That username is already taken.", usernameInput);
    return;
  }

  if (email === "") {
    showMessage("The email cannot be blank.", emailInput);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("The email must be a valid email address.", emailInput);
    return;
  }

  if (lowercaseEmail.endsWith("@example.com")) {
    showMessage('The email must not be from the domain "example.com."', emailInput);
    return;
  }

  if (password.length < 12) {
    showMessage("Passwords must be at least 12 characters long.", passwordInput);
    return;
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    showMessage("Passwords must have at least one uppercase and one lowercase letter.", passwordInput);
    return;
  }

  if (!/[0-9]/.test(password)) {
    showMessage("Passwords must contain at least one number.", passwordInput);
    return;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    showMessage("Passwords must contain at least one special character.", passwordInput);
    return;
  }

  if (password.toLowerCase().includes("password")) {
    showMessage('Passwords cannot contain the word "password".', passwordInput);
    return;
  }

  if (password.toLowerCase().includes(lowercaseUsername)) {
    showMessage("Passwords cannot contain the username.", passwordInput);
    return;
  }

  if (password !== passwordCheck) {
    showMessage("Both passwords must match.", passwordCheckInput);
    return;
  }

  if (!termsInput.checked) {
    showMessage("The terms and conditions must be accepted.", termsInput);
    return;
  }

  users.push({
    username: lowercaseUsername,
    email: lowercaseEmail,
    password: password
  });

  saveUsers(users);
  registrationForm.reset();
  showMessage("Registration successful!", null, true);
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const usernameInput = loginForm.username;
  const passwordInput = loginForm.password;
  const persistInput = loginForm.persist;

  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  const users = getUsers();
  const foundUser = users.find(user => user.username === username);

  if (username === "") {
    showMessage("The username cannot be blank.", usernameInput);
    return;
  }

  if (!foundUser) {
    showMessage("The username must exist.", usernameInput);
    return;
  }

  if (password === "") {
    showMessage("The password cannot be blank.", passwordInput);
    return;
  }

  if (password !== foundUser.password) {
    showMessage("The password must be correct.", passwordInput);
    return;
  }

  loginForm.reset();

  if (persistInput.checked) {
    showMessage("Login successful! You will stay logged in.", null, true);
  } else {
    showMessage("Login successful!", null, true);
  }
});