# alx_fe_javascrip# 📜 Dynamic Quote Generator

A fully functional, interactive web application that allows users to generate, add, filter, import/export, and synchronize inspirational quotes with a simulated server. Built with HTML, CSS, and vanilla JavaScript, this project showcases DOM manipulation, Web Storage API, JSON handling, and mock API interaction.

## 🚀 Features

- ✅ Random quote display with category-based filtering
- ✅ Add new quotes with custom categories
- ✅ Quotes stored and persisted using **Local Storage**
- ✅ Last viewed quote saved in **Session Storage**
- ✅ Import/Export quotes as JSON files
- ✅ Real-time category filter updates
- ✅ Stylish custom dropdown and UI
- ✅ Sync with **mock API (JSONPlaceholder)** and merge new quotes
- ✅ Conflict resolution: avoids duplicate quotes
- ✅ Periodic sync every 60 seconds
- ✅ UI notifications for imports, syncs, and errors

---

## 🛠️ Technologies Used

- **HTML5**
- **CSS3** (with custom styling and transitions)
- **JavaScript (ES6+)**
- **LocalStorage / SessionStorage**
- **JSONPlaceholder API** for mock server interactions

---

## 📁 Project Structure

dom-manipulation/
├── index.html # Main HTML structure
├── styles.css # Styling for layout, forms, and UI
└── quotes.json # (Optional) Example data for import


---

## 🧪 How to Use

1. **Clone the repository**
   ```bash
   git clone https://github.com/evianojay/alx_fe_javascript.git
   cd alx_fe_javascript/dom-manipulation

2. Open index.html in your browser

3. Use the app:

    Click “Show New Quote” to display a quote

    Add your own quotes via the input form

    Use the category dropdown to filter quotes

    Import or export your quotes in .json format

    Quotes automatically sync with a mock API

📦 JSON Format for Import
[
  {
    "text": "Your time is limited, so don't waste it living someone else's life.",
    "category": "Motivation"
  },
  {
    "text": "Creativity is intelligence having fun.",
    "category": "Inspiration"
  }
]
🧠 Learning Objectives
DOM manipulation using JavaScript

Working with Web Storage APIs

Parsing and handling JSON data

Implementing Import/Export functionality

Simulating API interaction with fetch

Building a responsive, interactive front-end app

📢 Acknowledgments
This project is part of the ALX Front-End Specialization and demonstrates the use of core web development concepts in real-world interactive applications.

🐛 Feedback & Contributions
Feel free to fork this project, raise issues, or contribute improvements!

🔗 License
MIT License. Free to use, modify, and share.