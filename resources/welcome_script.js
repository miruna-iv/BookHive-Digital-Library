document.addEventListener("DOMContentLoaded", () => {
  const quoteElement = document.getElementById("dynamic-quote");
  const quotes = [
    "Take the first step towards your very own digital library.",
    "A room without books is like a body without a soul.",
    "Reading is a discount ticket to everywhere.",
    "Books are a uniquely portable magic.",
    "Every hive needs its stories. Start yours today.",
  ];
  let quoteIndex = 0;

  setInterval(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    quoteElement.style.opacity = 0;
    setTimeout(() => {
      quoteElement.innerText = quotes[quoteIndex];
      quoteElement.style.opacity = 1;
    }, 500);
  }, 6000);

  const btnQuiz = document.getElementById("btn-quiz");
  const resultBox = document.getElementById("quiz-result");
  const moodSelect = document.getElementById("mood-select");

  const suggestions = {
    adventurous: ["Epic Fantasy", "Survival Thriller", "Space Opera"],
    romantic: ["Historical Romance", "Contemporary Drama", "Poetry Anthology"],
    mysterious: ["Nordic Noir", "Classic Whodunnit", "Psychological Thriller"],
    thoughtful: [
      "Philosophical Essays",
      "Biographies",
      "Scientific Non-Fiction",
    ],
  };

  btnQuiz.addEventListener("click", () => {
    const mood = moodSelect.value;
    const options = suggestions[mood];
    const randomChoice = options[Math.floor(Math.random() * options.length)];

    resultBox.style.display = "block";
    resultBox.innerHTML = `🐝 Based on your mood, we suggest: <strong>${randomChoice}</strong>`;

    resultBox.style.backgroundColor = "#fff9e6";
    resultBox.style.transition = "0.5s";
  });

  const bookStat = document.getElementById("stat-books");
  let bookCount = 12450;

  setInterval(() => {
    const increment = Math.floor(Math.random() * 4) + 1;
    bookCount += increment;
    bookStat.innerText = bookCount.toLocaleString();

    bookStat.style.color = "#ffb003";
    setTimeout(() => {
      bookStat.style.color = "#e0aa42";
    }, 300);
  }, 5000);
});
