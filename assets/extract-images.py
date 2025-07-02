import json
import requests
import copy
from pathlib import Path

# Define paths relative to the script's location
ASSETS_DIR = Path(__file__).parent
ASSETS_JSON_PATH = ASSETS_DIR / 'assets.json'
LOCAL_ASSETS_JSON_PATH = ASSETS_DIR / 'assets-local.json'
NOT_FOUND_JSON_PATH = ASSETS_DIR / 'not-found.json'

def download_and_organize_images():
    """
    Parses assets.json, downloads images, organizes them, and creates a new
    JSON file (assets-local.json) with local paths for the web app.

    - Creates directories for each category (e.g., assets/animals).
    - Downloads images and saves them to subdirectories based on the letter.
    - Creates 'assets-local.json' with updated local image paths.
    - Logs any failed downloads to 'not-found.json'.
    """
    if not ASSETS_JSON_PATH.is_file():
        print(f"Error: '{ASSETS_JSON_PATH}' not found.")
        return

    with open(ASSETS_JSON_PATH, 'r') as f:
        data = json.load(f)

    # Create a deep copy to modify with local paths
    local_data = copy.deepcopy(data)
    not_found_data = {}

    for category, items in data.items():
        category_dir = ASSETS_DIR / category
        category_dir.mkdir(exist_ok=True)
        print(f"Processing category: {category}...")

        for index, item in enumerate(items):
            letter = item.get('letter')
            word = item.get('word')
            image_url = item.get('image')

            if not all([letter, word, image_url]):
                print(f"Skipping invalid item: {item}")
                continue

            letter_dir = category_dir / letter.upper()
            letter_dir.mkdir(exist_ok=True)

            # Determine image extension from URL, default to .jpeg
            image_ext = '.avif'
            image_filename = f"{word.lower().replace(' ', '_')}{image_ext}"
            image_path = letter_dir / image_filename
            
            # The path for the web app should be relative to index.html
            local_image_path = f"assets/{category}/{letter.upper()}/{image_filename}"
            
            # Update the path in our new local data structure
            local_data[category][index]['image'] = local_image_path

            if image_path.exists():
                print(f"Skipping existing file: {image_path}")
                continue

            try:
                response = requests.get(image_url, stream=True, timeout=10)
                response.raise_for_status()

                with open(image_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                print(f"Successfully downloaded: {image_path}")

            except requests.exceptions.RequestException as e:
                print(f"Failed to download {image_url}: {e}")
                if category not in not_found_data:
                    not_found_data[category] = []
                
                failed_item = item.copy()
                failed_item['image'] = "image not found"
                not_found_data[category].append(failed_item)
                
                # Also update the local data to indicate failure
                local_data[category][index]['image'] = "image not found"


    # Write the new JSON with local paths
    with open(LOCAL_ASSETS_JSON_PATH, 'w') as f:
        json.dump(local_data, f, indent=4)
    print(f"\nSuccessfully created local assets file: {LOCAL_ASSETS_JSON_PATH}")


    if not_found_data:
        with open(NOT_FOUND_JSON_PATH, 'w') as f:
            json.dump(not_found_data, f, indent=4)
        print(f"Logged not found items to: {NOT_FOUND_JSON_PATH}")

if __name__ == "__main__":
    download_and_organize_images()