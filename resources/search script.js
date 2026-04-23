const searchBar = document.getElementById("searchBar");
const suggestions = document.getElementById("suggestions");

searchBar.addEventListener("input", async function () {
  const query = this.value.trim();

  if (query.length < 2) {
    suggestions.style.display = "none";
    return;
  }

  const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
  const data = await res.json();

  const books = data.docs.slice(0, 5); // primele 5 rezultate

  suggestions.innerHTML = "";

  books.forEach(book => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");

    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
      : "resurse/no_cover.png";

    item.innerHTML = `
      <img src="${cover}">
      <div>
        <strong>${book.title}</strong><br>
        <span>${book.author_name ? book.author_name[0] : "Unknown"}</span>
      </div>
    `;

    suggestions.appendChild(item);
  });

  suggestions.style.display = "block";
});
