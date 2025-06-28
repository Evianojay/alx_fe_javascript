let quotes = [];

// Load from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) quotes = JSON.parse(stored);
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate filter dropdown
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const selected = localStorage.getItem('selectedCategory') || 'all';

  const categories = Array.from(new Set(quotes.map(q => q.category)));
  filter.innerHTML = `<option value="all">All Categories</option>` + 
    categories.map(c => `<option value="${c}">${c}</option>`).join('');

  filter.value = selected;
}

// Show one random quote from current filter
function showRandomQuote() {
  const selected = document.getElementById('categoryFilter').value;
  const list = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);

  if (!list.length) {
    document.getElementById('quoteDisplay').innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  const random = list[Math.floor(Math.random() * list.length)];

  const box = document.getElementById('quoteDisplay');
  box.className = 'quote-box';
  box.innerHTML = `<blockquote>${random.text}</blockquote><p>— ${random.category}</p>`;

  sessionStorage.setItem('lastViewedQuote', JSON.stringify(random));
}

// Add new quote and update categories
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) return alert("Please enter both quote and category.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Filter based on dropdown
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

// Export JSON
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  reader.readAsText(event.target.files[0]);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
});
