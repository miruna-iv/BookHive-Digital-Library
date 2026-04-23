const form = document.getElementById("loginForm");
const title = document.getElementById("formTitle");
const toggleText = document.querySelector(".toggle-text");

let isLogin = true;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function renderForm() {
  if (isLogin) {
    title.textContent = "Login to BookHive";
    form.innerHTML = `
            <div class="input-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" class="btn">Login</button>
        `;
    toggleText.innerHTML = `Don’t have an account? <a href="#" id="toggleLink">Sign up here</a>`;
  } else {
    title.textContent = "Create your BookHive account";
    form.innerHTML = `
            <div class="input-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your full name" required />
            </div>
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Choose a username" required />
            </div>
            <div class="input-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Create a password" required />
            </div>
            <button type="submit" class="btn">Sign Up</button>
        `;
    toggleText.innerHTML = `Already have an account? <a href="#" id="loginToggle">Login here</a>`;
  }

  const toggleBtn = isLogin
    ? document.getElementById("toggleLink")
    : document.getElementById("loginToggle");
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    renderForm();
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  let users = JSON.parse(localStorage.getItem("bookHiveUsers") || "[]");

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  if (isLogin) {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Login successful! Welcome back, " + user.name + "!");
      window.location.href = "homepage.html";
    } else {
      alert(
        "Invalid email or password! Please check your credentials or create an account."
      );
    }
  } else {
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long, include one uppercase letter, one number, and can include special characters!"
      );
      return;
    }

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();

    if (users.find((u) => u.email === email)) {
      alert("An account with this email already exists!");
      return;
    }

    const newUser = { name, username, email, password };
    users.push(newUser);
    localStorage.setItem("bookHiveUsers", JSON.stringify(users));

    alert("Account created successfully! You can now login.");
    isLogin = true;
    renderForm();
  }
});

renderForm();
