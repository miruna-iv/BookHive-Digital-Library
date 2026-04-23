document.addEventListener("DOMContentLoaded", () => {
  const wantToReadContainer = document.querySelector(
    "#want-to-read .books-on-shelf"
  );
  const readContainer = document.querySelector("#read .books-on-shelf");
  const currentlyReadingContainer = document.querySelector(".current-book");
  const bookCard = currentlyReadingContainer.querySelector(".book-card");
  const progressInput = document.getElementById("progress");
  const updateBtn = document.getElementById("update-progress");

  function createBookMarkup(book) {
    const bookItem = document.createElement("div");
    bookItem.className = "book-item";
    bookItem.innerHTML = `
            <a href="book.html?id=${book.id}">
                <img src="${book.image}" style="width: 100%; border-radius: 8px; border: 1px solid #e0aa42;">
            </a>
            <p style="font-size: 0.9rem; margin: 8px 0; font-weight: bold;">${book.title}</p>
            <button class="delete-btn" data-id="${book.id}">🗑️</button>
        `;
    return bookItem;
  }

  function displayCurrentlyReading(book) {
    bookCard.style.display = "flex";
    const img = bookCard.querySelector("img");
    const title = document.getElementById("current-book-title");
    const author = document.getElementById("current-book-author");

    img.src = book.image;
    title.textContent = book.title;
    author.textContent = "Currently Reading";
    progressInput.value = book.progress || 0;
  }

  function loadCustomShelves() {
    const customShelves = JSON.parse(
      localStorage.getItem("customShelves") || "[]"
    );
    const shelvesContainer = document.querySelector(".user-shelves");

    document
      .querySelectorAll(".shelf.custom-shelf")
      .forEach((el) => el.remove());

    customShelves.forEach((shelfName) => {
      const shelfDiv = document.createElement("div");
      shelfDiv.className = "shelf custom-shelf";
      shelfDiv.id = `shelf-${shelfName.replace(/\s+/g, "-").toLowerCase()}`;

      shelfDiv.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3>${shelfName}</h3>
                    <button class="delete-shelf-btn" data-name="${shelfName}" style="background:none; border:none; cursor:pointer; color:red;">Șterge Raft</button>
                </div>
                <div class="books-on-shelf"></div>
            `;

      shelvesContainer.insertBefore(
        shelfDiv,
        document.getElementById("add-shelf")
      );
    });
  }

  function renderShelves() {
    const myBooks = JSON.parse(localStorage.getItem("myBooks") || "[]");

    document
      .querySelectorAll(".books-on-shelf")
      .forEach((container) => (container.innerHTML = ""));

    bookCard.style.display = "none";

    myBooks.forEach((book) => {
      if (book.status === "Currently Reading") {
        displayCurrentlyReading(book);
      } else if (book.status === "Want to Read") {
        const container = document.querySelector(
          "#want-to-read .books-on-shelf"
        );
        if (container) container.appendChild(createBookMarkup(book));
      } else if (book.status === "Read") {
        const container = document.querySelector("#read .books-on-shelf");
        if (container) container.appendChild(createBookMarkup(book));
      } else {
        const shelfId = `shelf-${book.status
          .replace(/\s+/g, "-")
          .toLowerCase()}`;
        const customContainer = document.querySelector(
          `#${shelfId} .books-on-shelf`
        );
        if (customContainer) {
          customContainer.appendChild(createBookMarkup(book));
        }
      }
    });
  }

  document.getElementById("add-shelf").addEventListener("click", () => {
    const shelfName = prompt("Introdu numele noului raft:");
    if (shelfName && shelfName.trim() !== "") {
      let customShelves = JSON.parse(
        localStorage.getItem("customShelves") || "[]"
      );
      if (!customShelves.includes(shelfName)) {
        customShelves.push(shelfName);
        localStorage.setItem("customShelves", JSON.stringify(customShelves));

        loadCustomShelves();
        renderShelves();
      } else {
        alert("Acest raft există deja!");
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-shelf-btn")) {
      const nameToRemove = e.target.getAttribute("data-name");
      if (confirm(`Ești sigur că vrei să ștergi raftul "${nameToRemove}"?`)) {
        let customShelves = JSON.parse(
          localStorage.getItem("customShelves") || "[]"
        );
        customShelves = customShelves.filter((name) => name !== nameToRemove);
        localStorage.setItem("customShelves", JSON.stringify(customShelves));

        loadCustomShelves();
        renderShelves();
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const bookId = e.target.getAttribute("data-id");
      let myBooks = JSON.parse(localStorage.getItem("myBooks") || "[]");
      myBooks = myBooks.filter((b) => b.id !== bookId);
      localStorage.setItem("myBooks", JSON.stringify(myBooks));
      renderShelves();
    }
  });

  updateBtn.addEventListener("click", () => {
    let value = parseInt(progressInput.value);
    let myBooks = JSON.parse(localStorage.getItem("myBooks") || "[]");

    if (value > 100) {
      alert("Progresul nu poate depăși 100%!");
      return;
    }
    if (value < 0 || isNaN(value)) value = 0;
    progressInput.value = value;

    const currentIndex = myBooks.findIndex(
      (b) => b.status === "Currently Reading"
    );

    if (currentIndex !== -1) {
      if (value === 100) {
        alert("Felicitări! Ai terminat de citit această carte! 🥳");
        myBooks[currentIndex].status = "Read";
        myBooks[currentIndex].progress = 100;
        myBooks[currentIndex].finishDate = new Date().toLocaleDateString();
      } else {
        myBooks[currentIndex].progress = value;
      }
      localStorage.setItem("myBooks", JSON.stringify(myBooks));
      renderShelves();
    } else {
      alert("Nu ai nicio carte în curs de citire!");
    }
  });

  loadCustomShelves();
  renderShelves();
});
