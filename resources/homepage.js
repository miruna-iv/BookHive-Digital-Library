document.addEventListener("DOMContentLoaded", () => {
  const weeklyImg = document.getElementById("weekly-book-img");
  const weeklyTitle = document.getElementById("weekly-book-title");
  const weeklyDesc = document.getElementById("weekly-book-desc");
  const recommendationsContainer = document.getElementById("recommendations");

  const now = new Date();
  const currentWeek = Math.ceil(now.getDate() / 7);
  const cacheKey = `weeklyBook_week_${currentWeek}`;

  function getSecureCover(info) {
    if (info.industryIdentifiers && info.industryIdentifiers.length > 0) {
      const isbn = info.industryIdentifiers.find((id) =>
        id.type.includes("ISBN")
      )?.identifier;
      if (isbn) {
        return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      }
    }

    if (info.imageLinks?.thumbnail) {
      return info.imageLinks.thumbnail.replace("http://", "https://");
    }
    return "resurse/placeholder.png";
  }

  async function fetchBooks(query) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=8`
      );
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Eroare la preluarea datelor:", error);
      return [];
    }
  }

  async function setupWeeklyBook() {
    const cachedBook = localStorage.getItem(cacheKey);

    if (cachedBook) {
      displayWeeklyBook(JSON.parse(cachedBook));
    } else {
      const books = await fetchBooks("subject:fantasy");
      if (books.length > 0) {
        const randomBook = books[Math.floor(Math.random() * books.length)];
        const info = randomBook.volumeInfo;

        const bookData = {
          id: randomBook.id,
          title: info.title,
          image: getSecureCover(info),
          description: info.description?.substring(0, 150) + "...",
        };

        localStorage.setItem(cacheKey, JSON.stringify(bookData));
        displayWeeklyBook(bookData);
      }
    }
  }

  function displayWeeklyBook(book) {
    weeklyImg.src = book.image;
    weeklyTitle.innerHTML = `<a href="book.html?id=${book.id}" class="book-link" data-id="${book.id}">${book.title}</a>`;
    weeklyDesc.textContent = book.description;
    weeklyTitle.style.color = "#b86e00";
  }

  async function setupRecommendations() {
    const genres = ["Fiction", "Mystery", "History", "Romance", "Science"];
    recommendationsContainer.innerHTML = "<h2>Recommendations ✨</h2>";

    for (const genre of genres) {
      const books = await fetchBooks(`subject:${genre}`);

      if (books.length > 0) {
        const book = books[Math.floor(Math.random() * books.length)];
        const info = book.volumeInfo;
        const secureImage = getSecureCover(info);

        const genreSection = document.createElement("div");
        genreSection.className = "genre-section";
        genreSection.innerHTML = `
          <h3 style="margin-left: 10px; color: #946817;">Top Pick for ${genre}</h3>
          <div class="book-recommendation" data-id="${book.id}">
              <a href="book.html?id=${book.id}" class="book-link" data-id="${
          book.id
        }">
                  <img src="${secureImage}" alt="Cover">
              </a>
              <div class="book-info">
                  <h3><a href="book.html?id=${
                    book.id
                  }" class="book-title-link book-link" data-id="${book.id}">${
          info.title
        }</a></h3>
                  <p><strong>Author:</strong> ${
                    info.authors?.join(", ") || "Unknown"
                  }</p>
                  <p>${
                    info.description
                      ? info.description.substring(0, 150) + "..."
                      : "No description available."
                  }</p>
                  <button class="save-btn" 
                          data-id="${book.id}" 
                          data-title="${info.title.replace(/"/g, "&quot;")}" 
                          data-img="${secureImage}">
                    ✨ Add to Want to Read
                  </button>
              </div>
          </div>
        `;

        // Evenimente mouse [cite: 1]
        genreSection.addEventListener("mouseenter", () => {
          genreSection.style.transform = "scale(1.01)";
          genreSection.style.transition = "transform 0.3s ease";
        });
        genreSection.addEventListener("mouseleave", () => {
          genreSection.style.transform = "scale(1)";
        });

        recommendationsContainer.appendChild(genreSection);
      }
    }
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest(".book-link");
    if (link) {
      const bookId = link.getAttribute("data-id");
      const parent =
        link.closest(".book-recommendation") ||
        document.querySelector(".weekly-book");
      const img = parent.querySelector("img").src;
      const title = parent.querySelector("h3")
        ? parent.querySelector("h3").textContent
        : parent.querySelector(".site-name").textContent;

      const bookData = {
        id: bookId,
        image: img,
        title: title,
      };
      localStorage.setItem("selectedBook", JSON.stringify(bookData));
    }
  });

  recommendationsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("save-btn")) {
      const btn = e.target;
      const bookId = btn.getAttribute("data-id");

      const bookToSave = {
        id: bookId,
        title: btn.getAttribute("data-title"),
        image: btn.getAttribute("data-img"),
        addedDate: new Date().toLocaleDateString(),
        status: "Want to Read",
      };

      let myBooks = JSON.parse(localStorage.getItem("myBooks") || "[]");

      if (!myBooks.find((b) => b.id === bookId)) {
        myBooks.push(bookToSave);
        localStorage.setItem("myBooks", JSON.stringify(myBooks));

        btn.innerHTML = "✓ Added to List";
        btn.style.backgroundColor = "#a8e6cf";
        btn.style.color = "#1b4d3e";
        btn.disabled = true;
      } else {
        alert("This book is already in your shelf!");
      }
    }
  });

  setupWeeklyBook();
  setupRecommendations();
});
