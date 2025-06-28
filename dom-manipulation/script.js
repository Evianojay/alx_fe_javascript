let quotes = [];

// Load saved quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) quotes = JSON.parse(stored);
}

// Save current quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate dropdown with unique categories
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selected = localStorage.getItem('selectedCategory') || 'all';

  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selected;
}

// Display a filtered quote based on the selected category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);

  const filtered = selected === 'all'
    ? quotes
    : quotes.filter(q => q.category === selected);

  const display = document.getElementById('quoteDisplay');
  display.className = 'quote-box';

  if (filtered.length === 0) {
    display.innerHTML = `<p>No quotes found for selected category.</p>`;
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  display.innerHTML = `<blockquote>${random.text}</blockquote><p>— ${random.category}</p>`;

  sessionStorage.setItem('lastViewedQuote', JSON.stringify(random));
}

// Add a new quote and update category dropdown
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) return alert("Please enter both quote and category.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  // Post to server (mock)
  postQuoteToServer({ quote: text, author: category });

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Post to mock API server
async function postQuoteToServer(quote) {
  try {
    const res = await fetch('https://dummyjson.com/quotes/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
    const result = await res.json();
    console.log('Quote posted:', result);
  } catch (error) {
    console.error('Failed to post quote:', error);
  }
}

// Export quotes as JSON
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import from uploaded JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Quotes imported successfully!');
  };
  reader.readAsText(event.target.files[0]);
}

// Fetch quotes from mock API
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://dummyjson.com/quotes');
    const data = await response.json();
    return data.quotes || [];
  } catch (error) {
    console.error('Failed to fetch from server:', error);
    return [];
  }
}

// Merge server quotes into local quotes
function mergeServerQuotes(serverQuotes) {
  const localMap = new Map(quotes.map(q => [q.text, q]));

  let newQuotesAdded = 0;
  serverQuotes.forEach(serverQuote => {
    if (!localMap.has(serverQuote.quote)) {
      quotes.push({ text: serverQuote.quote, category: serverQuote.author });
      newQuotesAdded++;
    }
  });

  if (newQuotesAdded > 0) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert(`${newQuotesAdded} new quotes synced from server.`);
  }
}

// Sync quotes from server and update local storage
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  mergeServerQuotes(serverQuotes);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById('newQuote').addEventListener('click', filterQuotes);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

  // Initial sync
  syncQuotes();

  // Periodic sync every 60 seconds
  setInterval(syncQuotes, 60000);
});
