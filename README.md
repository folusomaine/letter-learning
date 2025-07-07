# Letter Learning Fun!

A simple and interactive web application designed to help children learn the alphabet in a playful way. Each letter is associated with a word and an image, organized into categories.

## Current Features

*   **Interactive Letter Grid**: Click or type a letter to open a detailed learning modal.
*   **Speech Synthesis**: Utilizes the browser's built-in Web Speech API to pronounce letters and words.
*   **Dynamic Categories**: Easily switch between different topics. Currently, 'Animals' and 'Food' are enabled.
*   **Keyboard Navigation**: Navigate with arrow keys, select letters by typing, and close the modal with the 'Escape' key.
*   **Playful Animations**: Letters in the modal jump playfully when appearing or being navigated.
*   **Dark Mode**: A sleek dark mode for comfortable viewing in low-light environments.
*   **Dynamic Content**: All app content is loaded from a local JSON file, making it easy to add or change letters, words, and images.

## Features Not Yet Available

### Animal Sounds

*   **Status**: The "Animal Sound" button appears in the modal for the 'Animals' category but is currently disabled.
*   **Dependencies**: This feature requires audio files for each animal. The file paths will need to be added to `assets-local.json` and the playback logic implemented in `script.js`.

### Additional Categories (Food, Places & Objects)

*   **Status**: The data for 'Places' and 'Objects' exists in `assets.json`, but these categories are hidden from the UI to keep the experience focused.
*   **How to Enable**: To show these categories, you can remove them from the `hiddenCategories` array in `script.js`:
    ```javascript
    // located in the createCategoryButtons function in script.js
    const hiddenCategories = ['places', 'objects']; // Remove items to show them
    ```

## Getting Started

### Prerequisites

*   A modern web browser that supports the Web Speech API (e.g., Chrome, Firefox, Edge).
*   Python 3 (for running the local server and the asset downloader script).

### Local Development

1.  **Set Up Assets**: The application uses local images. The `assets/assets.json` file contains the list of all words and remote image URLs. To download them, run:
    ```sh
    python3 assets/extract-images.py
    ```
    This script will create an `images` directory and the `assets-local.json` file that the app uses.

2.  **Start the Local Server**: To run the app, you need a simple web server due to browser security policies.
    ```sh
    python3 -m http.server 8000
    ```

3.  **Open the App**: Open your browser and navigate to `http://localhost:8000`.

## Deployment

This is a static site, and you can host it for free on services like GitHub Pages, Netlify, or Vercel. These services provide the necessary web server, so the application will work just as it does locally.

### Deploying to GitHub Pages

1.  **Create a GitHub repository** and upload all your project files (`index.html`, the `assets` folder with `assets-local.json` and all the downloaded images, `README.md`, etc.).
2.  Go to your repository's **Settings** tab.
3.  In the "Code and automation" section of the sidebar, click **Pages**.
4.  Under "Build and deployment," for the **Source**, select **Deploy from a branch**.
5.  Select the `main` (or `master`) branch and the `/root` folder, then click **Save**.
6.  Your site will be live in a few minutes at `https://<your-username>.github.io/<your-repo-name>/`.

### Deploying to Netlify

1.  **Sign up for a free account** at [Netlify](https://netlify.com).
2.  From your Netlify dashboard, **drag and drop your project folder** (the one containing `index.html` and the `assets` folder) into the browser window.
3.  Netlify will automatically build and deploy your site and provide you with a live URL.

### Deploying to Vercel

1.  **Sign up for a free account** at [Vercel](https://vercel.com).
2.  **Install the Vercel CLI** on your computer by running `npm install -g vercel` in your terminal.
3.  Navigate to your project's root directory in the terminal and run the command `vercel`.
4.  Follow the on-screen prompts to link your project and deploy it. Vercel will provide a live URL once finished.

## Features to Implement in the Future

*   **Integrate Text To Speech Server**: Type a word in the input field to hear it pronounced. (Validate its a word)
*   **Add Animal Sounds**: Add animal sounds to the app for the Animals category.

