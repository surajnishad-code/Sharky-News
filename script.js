const apiKey = "551bada6715f4e17860905eb0f2dbf14";

const newsContainer = document.getElementById("newsContainer");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Show loader
function showLoader() {
    loader.style.display = "block";
    newsContainer.innerHTML = "";
}

// Hide loader
function hideLoader() {
    loader.style.display = "none";
}

// Handle Active Category
function setActiveCategory(clickedBtn) {
    if (!clickedBtn) return;

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked button
    clickedBtn.classList.add('active');
}

// Get news by category
async function getNews(category = "general", clickedBtn = null) {
    if (clickedBtn) {
        setActiveCategory(clickedBtn);
    }

    try {
        showLoader();

        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Failed to fetch news. Please try again later.");
        }

        const data = await res.json();

        if (data.articles.length === 0) {
            throw new Error("No news found for this category.");
        }

        displayNews(data.articles);
    } catch (error) {
        hideLoader();
        newsContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-light); padding: 40px;">
                <ion-icon name="alert-circle-outline" style="font-size: 3rem; color: var(--brand-red);"></ion-icon>
                <h2>Oops! Something went wrong</h2>
                <p>${error.message}</p>
            </div>`;
    }
}

// Search functionality
async function searchNews() {
    const query = searchInput.value.trim();

    if (query === "") {
        alert("Please enter a search term");
        return;
    }

    // Deselect all categories efficiently
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));

    try {
        showLoader();

        const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Search failed. Please try again.");
        }

        const data = await res.json();

        if (data.articles.length === 0) {
            throw new Error(`No results found for "${query}"`);
        }

        displayNews(data.articles);
    } catch (error) {
        hideLoader();
        newsContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-light); padding: 40px;">
                <ion-icon name="search-outline" style="font-size: 3rem;"></ion-icon>
                <h2>No matches found</h2>
                <p>${error.message}</p>
            </div>`;
    }
}

// Event Listeners for Search
searchBtn.addEventListener("click", searchNews);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchNews();
    }
});

// Display cards
function displayNews(articles) {
    hideLoader();

    newsContainer.innerHTML = "";

    articles.forEach(article => {
        // Filter out articles with no image or removed content
        if (!article.urlToImage || article.title === "[Removed]") return;

        const card = document.createElement("div");
        card.className = "news-card";

        // Format Date
        const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        card.innerHTML = `
            <img src="${article.urlToImage}" alt="${article.title}" loading="lazy">
            <h3>${article.title}</h3>
            <p>${article.description ? article.description.substring(0, 100) + '...' : "No description available."}</p>
            <div style="padding: 0 20px 10px; font-size: 0.8rem; color: #888;">
                <span>${date}</span>
            </div>
            <a href="${article.url}" target="_blank">Read Full Article</a>
        `;

        newsContainer.appendChild(card);
    });
}

// Dark mode toggle
const darkBtn = document.getElementById("darkModeBtn");
const icon = darkBtn.querySelector("ion-icon");

darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // Toggle icon
    if (document.body.classList.contains("dark")) {
        icon.setAttribute("name", "sunny-outline");
    } else {
        icon.setAttribute("name", "moon-outline");
    }
});

// Load default news on start
window.addEventListener('DOMContentLoaded', () => {
    // Set first category as active by default visually
    const generalBtn = document.querySelector('.category-btn');
    if (generalBtn) generalBtn.classList.add('active');

    getNews();
});
