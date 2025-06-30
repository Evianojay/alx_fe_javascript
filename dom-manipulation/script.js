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

// Show notification
function showNotification(message, type = 'success') {
  const note = document.getElementById('notification');
  note.textContent = message;
  note.className = `notification ${type}`;
  note.style.opacity = '1';
  setTimeout(() => (note.style.opacity = '0'), 4000);
}

// Populate category dropdown
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

// Display a single random quote (Required function for ALX)
function displayRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  display.className = 'quote-box';

  if (quotes.length === 0) {
    display.innerHTML = `<p>No quotes available.</p>`;
    return;
  }

  const random = quotes[Math.floor(Math.random() * quotes.length)];
  display.innerHTML = `<blockquote>${random.text}</blockquote><p>— ${random.category}</p>`;
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(random));
}

// Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = `<p>No quotes found for selected category.</p>`;
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerHTML =
    `<blockquote>${random.text}</blockquote><p>— ${random.category}</p>`;
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(random));
}

// Add quote logic (Required for ALX)
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return alert("Please enter both quote and category.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayRandomQuote(); // update DOM

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Export quotes
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import quotes
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    showNotification('Quotes imported successfully!', 'success');
  };
  reader.readAsText(event.target.files[0]);
}

// Fetch from API
async function fetchQuotesFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json();
    return data.map(post => ({
      text: post.title,
      category: post.body
    }));
  } catch (err) {
    console.error('Fetch failed', err);
    return [];
  }
}

// Post to mock API
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
    console.log('Quote posted to API:', result);
  } catch (error) {
    console.error('Post error:', error);
    showNotification('Failed to post quote.', 'error');
  }
}

// Merge server quotes
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
    showNotification(`Synced: ${newCount} new quote(s) added.`, 'success');
  } else {
    showNotification('Synced with server. No new quotes.', 'success');
  }
}

// Sync from server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  mergeServerQuotes(serverQuotes);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  displayRandomQuote(); // required by ALX

  document.getElementById('newQuote').addEventListener('click', displayRandomQuote); // ALX check
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

  syncQuotes();
  setInterval(syncQuotes, 60000);
});
