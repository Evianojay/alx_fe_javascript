// Quotes array
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do or do not. There is no try.", category: "Wisdom" }
];

// Show a random quote in the DOM
function showRandomQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  const quote = quotes[random];

  const display = document.getElementById("quoteDisplay");
  display.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>Category: ${quote.category}</em></p>
  `;
}

// Add a new quote to array and update DOM
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = {
      text: quoteText,
      category: quoteCategory
    };

    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
    showRandomQuote(); // Display after adding
  } else {
    alert("Please enter both quote and category.");
  }
}

// Event listener for showing a new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for adding a new quote
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Show one quote on load
document.addEventListener("DOMContentLoaded", showRandomQuote);
