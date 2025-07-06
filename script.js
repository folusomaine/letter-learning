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

const animalSoundButton = document.getElementById('animal-sound-btn');
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
    // Define categories to hide. Easy to update in the future.
    const hiddenCategories = ['food', 'places', 'objects'];
    const categories = Object.keys(allData).filter(c => !hiddenCategories.includes(c));
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
            
            
            createLetterGrid(); // Re-create the letter grid for the new category
        });
        categorySelector.appendChild(button);
    });
    
    // Activate the first category by default
    if (categorySelector.firstElementChild) {
        categorySelector.firstElementChild.classList.add('active');
        currentCategory = categories[0]; // Set initial category
        
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
        showLearningModal(itemIndex);
    } else {
        alert(`No entry for the letter '${letter}' in the '${currentCategory}' category.`);
    }
}

function playAnimalSound() {
    const item = allData[currentCategory][currentIndex];
    if (item && item.sound) {
        const sound = new Audio(item.sound);
        sound.play().catch(e => console.error("Error playing sound:", e));
    } else {
        console.log("No animal sound available for this item.");
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

    // Modal close button
    learningModal.querySelector('#close-modal').addEventListener('click', hideLearningModal);

    // Animal sound button
    animalSoundButton.addEventListener('click', playAnimalSound);

    // Modal navigation
    document.getElementById('modal-prev-btn').addEventListener('click', navigatePrev);
    document.getElementById('modal-next-btn').addEventListener('click', navigateNext);

    // Speak button
    document.getElementById('modal-speak-btn').addEventListener('click', playSound);
    document.addEventListener('keydown', handleKeyPress);
    learningModal.addEventListener('click', handleModalClick);
}

function handleKeyPress(event) {
    const key = event.key.toUpperCase();
    const isLetter = ALPHABET.includes(key);

    if (learningModal.classList.contains('visible')) {
        if (isLetter) {
            const newIndex = allData[currentCategory].findIndex(item => item.letter === key);
            if (newIndex !== -1) {
                showLearningModal(newIndex);
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
            showLearningModal(letterIndex);
        }
    }
}

function handleModalClick(event) {
    // Close the modal if the backdrop is clicked
    if (event.target === learningModal) {
        hideLearningModal();
    }
}



// --- MODAL MANAGEMENT ---

function updateAndShowModal() {
    // Show/hide animal sound button inside the modal
    if (currentCategory === 'animals') {
        animalSoundButton.style.display = 'inline-flex';
        // The feature is not ready, so the button is disabled.
        animalSoundButton.disabled = true;
    } else {
        animalSoundButton.style.display = 'none';
    }
    const item = allData[currentCategory][currentIndex];
    
    document.getElementById('modal-letter-display').textContent = item.letter;
    document.getElementById('modal-word-display').textContent = item.word;
    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-image').alt = `Image for ${item.word}`;

    playSound();
}

function showLearningModal(index) {
    currentIndex = index;
    updateAndShowModal();
    learningModal.classList.add('visible');
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
    if (!item) return;

    const letterAudioSrc = `assets/speech/letters/${item.letter}.wav`;
    const sanitizedWord = item.word.replace(/ /g, '_');
    const wordAudioSrc = `assets/speech/words/${sanitizedWord}.wav`;

    // Play the letter sound first, then play the word sound as a callback.
    playAudio(letterAudioSrc, () => playAudio(wordAudioSrc));
}

function playAudio(src, onEndCallback) {
    if (!src) return;

    const audio = new Audio(src);

    audio.onerror = () => {
        console.error(`Error loading audio: ${src}`);
        // If there's a callback, call it even on error to not break the chain.
        if (onEndCallback) onEndCallback();
    };

    if (onEndCallback) {
        audio.onended = onEndCallback;
    }

    audio.play().catch(e => console.error(`Error playing audio: ${e}`));
}

// --- INITIALIZATION ---
window.addEventListener('load', main);
