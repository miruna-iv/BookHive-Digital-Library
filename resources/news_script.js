document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-container");

  const articles = [
    {
      title: "The Most Anticipated Books of 2026",
      author: "Literary Times",
      date: "Jan 5, 2026",
      image:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      summary:
        "From epic fantasies to gripping thrillers, this year promises to be a landmark for readers worldwide. Explore our top picks for the season.",
      link: "#",
    },
    {
      title: "New Adaptation of 'The Picture of Dorian Gray'",
      author: "Cinema Daily",
      date: "Jan 3, 2026",
      image:
        "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      summary:
        "Oscar Wilde's masterpiece is returning to the big screen with a modern twist. The casting reveals have sparked intense debate among fans.",
      link: "#",
    },
    {
      title: "Local Bookstores Seeing a Major Resurgence",
      author: "Economic Journal",
      date: "Dec 30, 2025",
      image:
        "https://images.pexels.com/photos/1005012/pexels-photo-1005012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      summary:
        "Digital fatigue is driving readers back to physical shelves. Independent bookstores report record-breaking sales in the last quarter.",
      link: "#",
    },
    {
      title: "Interview: The Hidden Symbolism in Modern Fiction",
      author: "Creative Mind",
      date: "Dec 28, 2025",
      image:
        "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      summary:
        "We sit down with this year's Pulitzer winner to discuss how subtext and allegory are evolving in the age of social media.",
      link: "#",
    },
  ];

  function renderNews() {
    if (!newsContainer) return;
    newsContainer.innerHTML = "";

    articles.forEach((article) => {
      const articleCard = document.createElement("article");
      articleCard.className = "news-card";
      articleCard.innerHTML = `
                <div class="news-image">
                    <img src="${article.image}" alt="News Image" onerror="this.src='resurse/placeholder.png'">
                </div>
                <div class="news-content">
                    <p class="news-meta">By ${article.author} | ${article.date}</p>
                    <h2>${article.title}</h2>
                    <p class="news-summary">${article.summary}</p>
                    <a href="${article.link}" class="read-more">Read Full Story →</a>
                </div>
            `;
      newsContainer.appendChild(articleCard);
    });
  }

  renderNews();
});
