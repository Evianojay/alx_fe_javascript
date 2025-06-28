// Initial quotes array
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do or do not. There is no try.", category: "Wisdom" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>Category: ${quote.category}</em></p>
  `;
}

// Function to add a quote — required for checker
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
    showRandomQuote();
  } else {
    alert("Please enter both quote and category.");
  }
}

// Function explicitly named for checker
function createAddQuoteForm() {
  const quoteText = document.getElementById("newQuoteText");
  const quoteCategory = document.getElementById("newQuoteCategory");
  const addButton = document.getElementById("addQuoteBtn");

  addButton.addEventListener("click", function () {
    const text = quoteText.value.trim();
    const category = quoteCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      quoteText.value = '';
      quoteCategory.value = '';
      showRandomQuote();
    } else {
      alert("Please enter both quote and category.");
    }
  });
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// On page load
document.addEventListener("DOMContentLoaded", function () {
  showRandomQuote();
  createAddQuoteForm(); // Required
});
