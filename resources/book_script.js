document.addEventListener("DOMContentLoaded", async () => {
  const coverImg = document.getElementById("book-cover");
  const titleElem = document.getElementById("book-title");
  const authorElem = document.getElementById("book-author");
  const descElem = document.getElementById("book-description");
  const shelfSelectorBtn = document.getElementById("shelf-selector-btn");
  const shelfOptions = document.getElementById("shelf-options");
  const readingBtn = document.getElementById("mark-reading");
  const similarContainer = document.getElementById("similar-container");
  const genresTitle = document.querySelector(".right-panel h3:last-of-type");
  const genresList = document.getElementById("book-genres");

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (!bookId) {
    window.location.href = "homepage.html";
    return;
  }

  const selectedBook = JSON.parse(localStorage.getItem("selectedBook"));
  if (selectedBook && selectedBook.id === bookId) {
    titleElem.textContent = selectedBook.title;
    coverImg.src = selectedBook.image;
  }

  function getHighResCover(info) {
    if (info.industryIdentifiers) {
      const isbn = info.industryIdentifiers.find((id) =>
        id.type.includes("ISBN")
      )?.identifier;
      if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    }
    return (
      info.imageLinks?.medium ||
      info.imageLinks?.thumbnail?.replace("http://", "https://") ||
      "resurse/book_placeholder.png"
    );
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`
    );
    const data = await response.json();
    const info = data.volumeInfo;

    titleElem.textContent = info.title;
    authorElem.textContent = info.authors
      ? `By ${info.authors.join(", ")}`
      : "Unknown Author";
    descElem.innerHTML = info.description || "No description available.";
    const stableCover = getHighResCover(info);
    coverImg.src = stableCover;

    if (info.categories && info.categories.length > 0) {
      genresList.innerHTML = "";
      info.categories.forEach((genre) => {
        const li = document.createElement("li");
        li.textContent = genre;
        genresList.appendChild(li);
      });
      fetchSimilarBooks(info.categories[0], bookId);
    } else {
      if (genresTitle) genresTitle.remove();
      if (genresList) genresList.remove();
    }

    readingBtn.addEventListener("click", () => {
      saveBookToSpecificShelf("Currently Reading", info.title, stableCover);
      alert("Added to Currently Reading!");
    });

    if (shelfSelectorBtn) {
      shelfSelectorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        populateShelfMenu(info.title, stableCover);
        shelfOptions.classList.toggle("show-shelves");
      });
    }
  } catch (error) {
    console.error("Eroare:", error);
  }

  function populateShelfMenu(bookTitle, bookImg) {
    shelfOptions.innerHTML = "";
    const standardShelves = ["Want to Read", "Read"];
    const customShelves = JSON.parse(
      localStorage.getItem("customShelves") || "[]"
    );
    const allShelves = [...standardShelves, ...customShelves];

    allShelves.forEach((shelfName) => {
      const btn = document.createElement("button");
      btn.textContent = shelfName;
      btn.addEventListener("click", () => {
        saveBookToSpecificShelf(shelfName, bookTitle, bookImg);
        shelfOptions.classList.remove("show-shelves");
      });
      shelfOptions.appendChild(btn);
    });
  }

  window.addEventListener("click", () => {
    if (shelfOptions) shelfOptions.classList.remove("show-shelves");
  });

  async function fetchSimilarBooks(genre, currentId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=6`
      );
      const data = await response.json();
      similarContainer.innerHTML = "";
      if (data.items) {
        const filteredBooks = data.items
          .filter((item) => item.id !== currentId)
          .slice(0, 5);
        filteredBooks.forEach((book) => {
          const sInfo = book.volumeInfo;
          const sImg =
            sInfo.imageLinks?.thumbnail?.replace("http://", "https://") ||
            "resurse/book_placeholder.png";
          const bookDiv = document.createElement("div");
          bookDiv.innerHTML = `
            <a href="book.html?id=${
              book.id
            }" style="text-decoration:none; color:inherit;">
              <img src="${sImg}" style="width:120px; height:180px; border-radius:5px; border:2px solid #e0aa42;">
              <p style="font-size:0.8rem; margin-top:5px; font-weight:bold;">${sInfo.title.substring(
                0,
                30
              )}...</p>
            </a>
          `;
          similarContainer.appendChild(bookDiv);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  function saveBookToSpecificShelf(shelfName, title, img) {
    let myBooks = JSON.parse(localStorage.getItem("myBooks") || "[]");
    const exists = myBooks.find((b) => b.id === bookId);
    if (exists) {
      exists.status = shelfName;
      if (shelfName === "Read") exists.progress = 100;
    } else {
      myBooks.push({
        id: bookId,
        title: title,
        image: img,
        status: shelfName,
        addedDate: new Date().toLocaleDateString(),
        progress: shelfName === "Read" ? 100 : 0,
      });
    }
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
    if (shelfName !== "Currently Reading")
      alert(`Book moved to: ${shelfName} ✨`);
  }
});
