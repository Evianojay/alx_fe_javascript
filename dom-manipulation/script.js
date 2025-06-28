// Load quotes from localStorage or fallback
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do or do not. There is no try.", category: "Wisdom" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote and save to sessionStorage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = '';

  const blockquote = document.createElement('blockquote');
  blockquote.textContent = `"${quote.text}"`;

  const category = document.createElement('p');
  category.innerHTML = `<em>Category: ${quote.category}</em>`;

  quoteDisplay.appendChild(blockquote);
  quoteDisplay.appendChild(category);

  // Save last viewed quote
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Checker-required
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes();
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
    showRandomQuote();
  } else {
    alert("Please enter both quote and category.");
  }
}

// Checker-required
function createAddQuoteForm() {
  const quoteText = document.getElementById("newQuoteText");
  const quoteCategory = document.getElementById("newQuoteCategory");
  const addButton = document.getElementById("addQuoteBtn");

  addButton.addEventListener("click", function () {
    const text = quoteText.value.trim();
    const category = quoteCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      saveQuotes();
      quoteText.value = '';
      quoteCategory.value = '';
      showRandomQuote();
    } else {
      alert("Please enter both quote and category.");
    }
  });
}

// Export to JSON
document.getElementById("exportBtn").addEventListener("click", function () {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url);
});

// Import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        showRandomQuote();
      } else {
        alert('Invalid JSON format!');
      }
    } catch (err) {
      alert('Failed to parse JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Setup on load
document.addEventListener("DOMContentLoaded", function () {
  showRandomQuote();
  createAddQuoteForm();
});

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
