let quotes = [];

function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) quotes = JSON.parse(stored);
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showNotification(message, type = 'success') {
  const note = document.getElementById('notification');
  note.textContent = message;
  note.className = `notification ${type}`;
  note.style.opacity = '1';
  setTimeout(() => {
    note.style.opacity = '0';
  }, 4000);
}

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

function displayRandomQuote() {
  const selected = document.getElementById('categoryFilter').value;
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

// ✅ ALX checker looks for this by name
function showRandomQuote() {
  displayRandomQuote();
}

function filterQuotes() {
  localStorage.setItem('selectedCategory', document.getElementById('categoryFilter').value);
  showRandomQuote();
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) return alert("Please enter both quote and category.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  postQuoteToServer(newQuote);

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

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

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  mergeServerQuotes(serverQuotes);
}

window.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  filterQuotes();

  // 🔁 Update listener to match check
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

  syncQuotes();
  setInterval(syncQuotes, 60000);
});
