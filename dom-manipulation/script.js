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

// Show notification in UI
function showNotification(message, type = 'success') {
  const note = document.getElementById('notification');
  note.textContent = message;
  note.className = `notification ${type}`;
  note.style.opacity = '1';
  setTimeout(() => {
    note.style.opacity = '0';
  }, 4000);
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
  postQuoteToServer(newQuote);

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// JSON Export
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// JSON Import
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification('Quotes imported successfully!', 'success');
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Mock API GET - Fetch quotes from required endpoint
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    return data.map(post => ({
      text: post.title,
      category: post.body
    }));
  } catch (error) {
    console.error('Failed to fetch from server:', error);
    showNotification('Error fetching from server!', 'error');
    return [];
  }
}

// ✅ Mock API POST - Push new quote to mock API
async function postQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      })
    });
    const result = await response.json();
    console.log('Quote posted to mock API:', result);
  } catch (error) {
    console.error('Failed to post quote:', error);
    showNotification('Failed to post quote to server.', 'error');
  }
}

// ✅ Merge quotes and update UI
function mergeServerQuotes(serverQuotes) {
  const localMap = new Map(quotes.map(q => [q.text, q]));
  let newCount = 0;

  serverQuotes.forEach(serverQuote => {
    if (!localMap.has(serverQuote.text)) {
      quotes.push(serverQuote);
      newCount++;
    }
  });

  if (newCount > 0) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification(`Quotes synced with server! ${newCount} new quote(s) added.`, 'success');
  } else {
    showNotification('Quotes synced with server! No new quotes found.', 'success');
  }
}

// ✅ Main sync function
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

  // Initial and periodic sync
  syncQuotes();
  setInterval(syncQuotes, 60000);
});
