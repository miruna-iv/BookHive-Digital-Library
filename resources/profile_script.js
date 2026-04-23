document.addEventListener("DOMContentLoaded", () => {
  const currentUserData = localStorage.getItem("currentUser");
  if (!currentUserData) {
    alert("Sesiune expirată sau inexistentă. Te rugăm să te loghezi.");
    window.location.href = "login.html";
    return;
  }

  const currentUser = JSON.parse(currentUserData);
  const displayName = document.getElementById("display-name");
  const displayUsername = document.getElementById("display-username");
  const displayEmail = document.getElementById("display-email");
  const profileCard = document.getElementById("profileCard");
  const goalInput = document.getElementById("reading-goal");
  const goalVal = document.getElementById("goal-val");

  if (displayName) displayName.textContent = currentUser.name || "N/A";
  if (displayUsername)
    displayUsername.textContent = `@${currentUser.username || "guest"}`;
  if (displayEmail) displayEmail.textContent = currentUser.email || "N/A";

  //Range Input (Obiectiv Pagini)
  if (goalInput && goalVal) {
    goalInput.addEventListener("input", (e) => {
      goalVal.textContent = e.target.value;
    });
  }

  //Schimbarea aleatoare a proprietăților (Math.random) + getComputedStyle
  const randomizeBtn = document.getElementById("randomize-style");
  if (randomizeBtn && profileCard) {
    randomizeBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Cerință: stopPropagation

      const randomHue = Math.floor(Math.random() * 360);
      const newBorder = `3px solid hsl(${randomHue}, 70%, 50%)`;

      profileCard.style.border = newBorder;
      profileCard.style.transform = `scale(${0.98 + Math.random() * 0.05})`;

      //getComputedStyle
      const computedStyle = window.getComputedStyle(profileCard);
      console.log("Noua culoare a bordurii este:", computedStyle.borderColor);
    });
  }

  //  classList (Highlight la hover)
  if (profileCard) {
    profileCard.addEventListener("mouseenter", () => {
      profileCard.classList.add("highlight");
    });
    profileCard.addEventListener("mouseleave", () => {
      profileCard.classList.remove("highlight");
    });
  }

  // setTimeout
  setTimeout(() => {
    console.log("Profil încărcat cu succes pentru:", currentUser.username);
  }, 1000);

  // Logout cu setInterval
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      let count = 3;
      logoutBtn.disabled = true;

      const timer = setInterval(() => {
        logoutBtn.innerText = `Logging out in ${count}...`;
        count--;

        if (count < 0) {
          clearInterval(timer);
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("currentUser");
          window.location.href = "login.html";
        }
      }, 1000);
    });
  }
});
