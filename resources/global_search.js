document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
  const suggestions = document.getElementById("suggestions");

  if (!searchBar || !suggestions) return;

  searchBar.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
      suggestions.style.display = "none";
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`
      );
      const data = await response.json();
      renderSuggestions(data.items || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  });

  function renderSuggestions(books) {
    suggestions.innerHTML = "";

    if (books.length === 0) {
      suggestions.style.display = "none";
      return;
    }

    books.forEach((book) => {
      const info = book.volumeInfo;
      const id = book.id;
      const title = info.title;
      const img =
        info.imageLinks?.thumbnail?.replace("http://", "https://") ||
        "resurse/book_placeholder.png";

      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.innerHTML = `
        <img src="${img}" alt="cover">
        <span>${title}</span>
      `;

      item.addEventListener("click", () => {
        const bookData = { id, title, image: img };
        localStorage.setItem("selectedBook", JSON.stringify(bookData));
        window.location.href = `book.html?id=${id}`;
      });

      suggestions.appendChild(item);
    });

    suggestions.style.display = "block";
  }

  document.addEventListener("click", (e) => {
    if (!searchBar.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.style.display = "none";
    }
  });
});
