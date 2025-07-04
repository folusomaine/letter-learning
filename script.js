// --- STATE MANAGEMENT ---
let allData = {};
let currentCategory = 'animals';
let currentIndex = 0;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// --- DOM ELEMENTS ---
const appContainer = document.querySelector('.app-container');
const categorySelector = document.querySelector('.category-selector');
const letterGrid = document.getElementById('letter-grid');
const learningModal = document.getElementById('learning-modal');
const infoModal = document.getElementById('info-modal');
const soundToggle = document.querySelector('.sound-toggle');
const darkModeSwitch = document.getElementById('dark-mode-switch');

// --- CORE APPLICATION LOGIC ---

/**
 * Fetches data and initializes the application.
 */
async function main() {
    try {
        const response = await fetch('assets/assets-local.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        allData = await response.json();
        console.log("Data loaded, inspecting contents:", allData);
        console.log("Successfully loaded local assets.");
        initApp();
    } catch (error) {
        console.error("Failed to load local assets:", error);
        appContainer.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--color-primary);">
                                    <h2><i class="fas fa-exclamation-triangle"></i> Error Loading Data</h2>
                                    <p>Could not load 'assets/assets-local.json'.</p>
                                    <p>Please ensure the file exists and this page is served from a local server.</p>
                                  </div>`;
    }
}

/**
 * Initializes the application components and event listeners.
 */
function initApp() {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeSwitch.checked = true;
    }
    createCategoryButtons();
    setupEventListeners();
}

// --- UI BUILDERS ---

function createCategoryButtons() {
    const categories = Object.keys(allData);
    const categorySelector = document.querySelector('.category-selector');
    categorySelector.innerHTML = ''; // Clear existing buttons

    categories.forEach(category => {
        const button = document.createElement('button');
        const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        button.textContent = capitalizedCategory;
        button.classList.add('category-btn');

        button.addEventListener('click', () => {
            currentCategory = category; // Keep this lowercase for data access
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide animal sound toggle based on the original (lowercase) category name
            soundToggle.style.display = category === 'animals' ? 'flex' : 'none';
            createLetterGrid(); // Re-create the letter grid for the new category
        });
        categorySelector.appendChild(button);
    });
    
    // Activate the first category by default
    if (categorySelector.firstElementChild) {
        categorySelector.firstElementChild.classList.add('active');
        currentCategory = categories[0]; // Set initial category
        soundToggle.style.display = currentCategory === 'animals' ? 'flex' : 'none';
        createLetterGrid(); // Initial grid load
    }
}

function createLetterGrid() {
    letterGrid.innerHTML = '';
    ALPHABET.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.textContent = letter;
        card.dataset.letter = letter;
        card.addEventListener('click', () => handleLetterClick(letter));
        letterGrid.appendChild(card);
    });
}

// --- EVENT HANDLERS ---

function handleLetterClick(letter) {
    const categoryData = allData[currentCategory];
    const itemIndex = categoryData.findIndex(item => item.letter === letter);

    if (itemIndex !== -1) {
        currentIndex = itemIndex;
        updateAndShowModal();
    } else {
        alert(`No entry for the letter '${letter}' in the '${currentCategory}' category.`);
    }
}

function setupEventListeners() {
    // Dark Mode Toggle
    darkModeSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Modal close buttons
    learningModal.querySelector('#close-modal').addEventListener('click', hideLearningModal);
    infoModal.querySelector('#close-info-modal').addEventListener('click', hideInfoModal);

    // Info button
    document.getElementById('info-button').addEventListener('click', showInfoModal);

    // Modal navigation
    document.getElementById('modal-prev-btn').addEventListener('click', navigatePrev);
    document.getElementById('modal-next-btn').addEventListener('click', navigateNext);

    // Speak button
    document.getElementById('modal-speak-btn').addEventListener('click', playSound);
    document.addEventListener('keydown', handleKeyPress);
    learningModal.addEventListener('click', handleModalClick);
    infoModal.addEventListener('click', handleModalClick);
}

function handleKeyPress(event) {
    const key = event.key.toUpperCase();
    const isLetter = ALPHABET.includes(key);

    if (learningModal.classList.contains('visible')) {
        if (isLetter) {
            const newIndex = allData[currentCategory].findIndex(item => item.letter === key);
            if (newIndex !== -1) {
                currentIndex = newIndex;
                updateAndShowModal();
            }
        } else if (event.key === 'ArrowLeft') {
            navigatePrev();
        } else if (event.key === 'ArrowRight') {
            navigateNext();
        } else if (event.key === 'Escape') {
            hideLearningModal();
        }
        return; // Prevent further key processing
    }

    // Handle opening modal with a letter key
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        const letter = event.key.toUpperCase();
        const currentCategoryData = allData[currentCategory];
        const letterIndex = currentCategoryData.findIndex(item => item.letter === letter);
        if (letterIndex !== -1) {
            currentIndex = letterIndex;
            updateAndShowModal();
        }
    }
}

function handleModalClick(event) {
    if (event.target === learningModal || event.target === infoModal) {
        hideLearningModal();
        hideInfoModal();
    }
}

function showInfoModal() {
    infoModal.classList.add('visible');
}

function hideInfoModal() {
    infoModal.classList.remove('visible');
}

// --- MODAL MANAGEMENT ---

function updateAndShowModal() {
    const item = allData[currentCategory][currentIndex];
    
    document.getElementById('modal-letter-display').textContent = item.letter;
    document.getElementById('modal-word-display').textContent = item.word;
    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-image').alt = `Image for ${item.word}`;

    learningModal.classList.add('visible');
    playSound();
}

function hideLearningModal() {
    learningModal.classList.remove('visible');
}

// --- NAVIGATION & SOUND ---

function navigatePrev() {
    const len = allData[currentCategory].length;
    currentIndex = (currentIndex - 1 + len) % len;
    updateAndShowModal();
}

function navigateNext() {
    currentIndex = (currentIndex + 1) % allData[currentCategory].length;
    updateAndShowModal();
}

function playSound() {
    const item = allData[currentCategory][currentIndex];
    // Simple speech for now. Animal sounds can be added later.
    speak(item.letter, () => speak(item.word));
}

function speak(text, onEndCallback) {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    if (onEndCallback) {
        utterance.onend = onEndCallback;
    }
    speechSynthesis.speak(utterance);
}

// --- INITIALIZATION ---
window.addEventListener('load', main);
