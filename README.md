# Letter Learning Web App

A simple, interactive web application designed to help children learn the alphabet. Each letter is associated with a word and an image, organized into categories like animals, food, places, and objects.

[Watch a Demo on YouTube on generating speech for the words by setting up a Text To Speech server](https://www.youtube.com/watch?v=p55ph0gm3lA)

## Features

*   **Interactive Learning**: Click through letters, hear them pronounced, and see corresponding images.
*   **Multiple Categories**: Switch between animals, food, places, and objects.
*   **Speech Synthesis**: Hear the pronunciation for both letters and words.
*   **Keyboard Navigation**: Use arrow keys for easy navigation.
*   **Dynamic Content**: Asset data is loaded from a local JSON file, making it easy to update and manage.

## Getting Started

### Prerequisites

*   Python 3 (to run the image downloader script and local server)
*   The `requests` library for Python (`pip install requests`)

### Asset Setup

The application uses local images which are downloaded and organized by a Python script.

1.  **Review Assets**: The `assets/assets.json` file contains the list of all words and remote image URLs. You can customize this file.
2.  **Download Images**: Run the Python script to download the images and create the `assets-local.json` file that the app uses.
    ```sh
    python3 assets/extract-images.py
    ```
    This will create an `images` directory with all the images and the `assets-local.json` file.

## Local Development

To run the application on your local machine, you need to use a simple web server. This is because modern browsers have security restrictions that prevent web pages from loading local files directly.

1.  **Start the server**:
    In your terminal, navigate to the project's root directory and run:
    ```sh
    python3 -m http.server 8000
    ```
2.  **Open the app**:
    Open your web browser and go to [http://localhost:8000](http://localhost:8000).

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

