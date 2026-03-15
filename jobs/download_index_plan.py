import os
import requests
import zipfile
import io
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
INDEX_PLAN_DIR = os.path.join(DATA_DIR, "Index Plan")

# Direct download link provided
DOWNLOAD_URL = "https://static.csdi.gov.hk/csdi-webpage/download/common/3d785e30139e61e2b09f13c95327598eabaef3accad32fb4a96b7b386edf8cb8"

def download_and_extract():
    if not os.path.exists(INDEX_PLAN_DIR):
        os.makedirs(INDEX_PLAN_DIR)

    print(f"Downloading from {DOWNLOAD_URL}...")
    try:
        response = requests.get(DOWNLOAD_URL, stream=True, timeout=120)  # CSDI might be slow
        response.raise_for_status()
        
        print("Download complete. Extracting...")
        
        # Check if it's a valid zip before proceeding
        try:
            with zipfile.ZipFile(io.BytesIO(response.content)) as z:
                print(f"Extracting directly to: {INDEX_PLAN_DIR}")
                z.extractall(INDEX_PLAN_DIR)
                
                # Move PDF files from subfolders to root (Flatten)
                pdf_count = 0
                for root, dirs, files in os.walk(INDEX_PLAN_DIR):
                    if root == INDEX_PLAN_DIR:
                        pdf_count += len([f for f in files if f.lower().endswith('.pdf')])
                        continue
                        
                    for file in files:
                        if file.lower().endswith('.pdf'):
                            src_path = os.path.join(root, file)
                            dest_path = os.path.join(INDEX_PLAN_DIR, file)
                            
                            # Handle duplicate filenames
                            if os.path.exists(dest_path):
                                base, ext = os.path.splitext(file)
                                counter = 1
                                while os.path.exists(os.path.join(INDEX_PLAN_DIR, f"{base}_{counter}{ext}")):
                                    counter += 1
                                dest_path = os.path.join(INDEX_PLAN_DIR, f"{base}_{counter}{ext}")

                            shutil.move(src_path, dest_path)
                            pdf_count += 1
                            
                # Clean up empty directories
                for root, dirs, files in os.walk(INDEX_PLAN_DIR, topdown=False):
                    for name in dirs:
                        try:
                            os.rmdir(os.path.join(root, name))
                        except OSError:
                            pass # Directory not empty

                print(f"Successfully extracted {pdf_count} PDF files to {INDEX_PLAN_DIR}")
                
        except zipfile.BadZipFile:
            print("Error: The downloaded file is not a valid ZIP file.")
            
    except requests.RequestException as e:
        print(f"Failed to download file: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    download_and_extract()
