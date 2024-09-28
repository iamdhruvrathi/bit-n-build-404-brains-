// Select elements
const container = document.querySelector(".container");
const signinForm = document.querySelector(".signin-form");
const loginForm = document.querySelector(".login-form");
const toggleLogin = document.getElementById("toggle-login");
const toggleSignin = document.getElementById("toggle-signin");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Show the login form by default, no changes needed here as login-form is initially displayed

// Toggle to show the login form
toggleLogin.addEventListener("click", (e) => {
  e.preventDefault();
  signinForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  container.classList.add("pulse");
  setTimeout(() => container.classList.remove("pulse"), 500);
});

// Toggle to show the sign-up form
toggleSignin.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  signinForm.classList.remove("hidden");
  container.classList.add("pulse");
  setTimeout(() => container.classList.remove("pulse"), 500);
});

// Toggle dark mode
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  container.classList.add("shake");
  setTimeout(() => container.classList.remove("shake"), 500);
});

// Handle sign-up form submission
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value; // Capture email value
  const password = document.getElementById("signup-password").value;
  console.log("Sign up:", { username, email, password });
  signinForm.classList.add("pulse");
  setTimeout(() => signinForm.classList.remove("pulse"), 500);
});

// Handle login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  console.log("Log in:", { username, password });
  loginForm.classList.add("pulse");
  setTimeout(() => loginForm.classList.remove("pulse"), 500);
});
