document.addEventListener("DOMContentLoaded", () => {
  const friendSearch = document.getElementById("friendSearch");
  const noFriendsSection = document.getElementById("no-friends");
  const friendsList = document.getElementById("friends-list");

  const allUsers = [
    {
      id: 1,
      name: "Ana Maria",
      username: "ana_books",
      avatar: "resurse/avatar1.png",
    },
    {
      id: 2,
      name: "Marius Ionescu",
      username: "marius_reader",
      avatar: "resurse/avatar2.png",
    },
    {
      id: 3,
      name: "Elena P.",
      username: "elena_reads",
      avatar: "resurse/avatar3.png",
    },
    {
      id: 4,
      name: "Vlad Dragomir",
      username: "vlad_the_reader",
      avatar: "resurse/avatar4.png",
    },
    {
      id: 5,
      name: "Miruna Ivan",
      username: "miruna_maria",
      avatar: "resurse/bee_reading.png",
    },
  ];

  function renderFriends() {
    const myFriends = JSON.parse(
      localStorage.getItem("bookHiveFriends") || "[]"
    );

    if (myFriends.length === 0) {
      if (noFriendsSection) noFriendsSection.style.display = "block";
      if (friendsList) friendsList.innerHTML = "";
    } else {
      if (noFriendsSection) noFriendsSection.style.display = "none";

      friendsList.innerHTML = "<h2>Your Friends 🐝</h2>";
      friendsList.className = "friends-grid";

      myFriends.forEach((friend) => {
        const card = document.createElement("div");
        card.className = "friend-card";
        card.innerHTML = `
          <img src="${friend.avatar}" alt="Avatar" class="friend-avatar" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border: 2px solid #e0aa42;">
          <div class="friend-info">
            <h3 style="margin:0; color: #5a3d1c;">${friend.name}</h3>
            <p style="margin:5px 0; color: #946817;">@${friend.username}</p>
            <button class="remove-friend-btn" data-id="${friend.id}" style="background:#ff6b6b; color:white; border:none; border-radius:5px; cursor:pointer; padding:5px 10px; font-weight:bold;">Remove</button>
          </div>
        `;
        friendsList.appendChild(card);
      });
    }
  }

  friendSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const term = friendSearch.value.trim().toLowerCase();

      const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;

      if (!usernameRegex.test(term)) {
        alert(
          "Eroare: Introdu un username valid (3-15 caractere, fără spații sau simboluri speciale)."
        );
        return;
      }

      const match = allUsers.find((u) => u.username.toLowerCase() === term);

      if (match) {
        let myFriends = JSON.parse(
          localStorage.getItem("bookHiveFriends") || "[]"
        );

        if (!myFriends.find((f) => f.id === match.id)) {
          myFriends.push(match);
          localStorage.setItem("bookHiveFriends", JSON.stringify(myFriends));
          friendSearch.value = "";
          renderFriends();
          alert(`L-ai adăugat pe ${match.name}! ✨`);
        } else {
          alert("Sunteți deja prieteni!");
        }
      } else {
        alert("Utilizatorul nu a fost găsit în baza de date BookHive.");
      }
    }
  });
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-friend-btn")) {
      const friendId = parseInt(e.target.getAttribute("data-id"));
      let myFriends = JSON.parse(
        localStorage.getItem("bookHiveFriends") || "[]"
      );
      myFriends = myFriends.filter((f) => f.id !== friendId);

      localStorage.setItem("bookHiveFriends", JSON.stringify(myFriends));
      renderFriends();
    }
  });
  renderFriends();
});
