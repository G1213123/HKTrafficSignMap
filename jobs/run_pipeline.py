import os
import time
import sys

# Import job modules
# Ensure the current directory is in sys.path to allow imports if running from root
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

try:
    import download_index_plan
    import convert_whole_pdf_to_svg
    import extract_svgs_viewbox
    import sync_wfs_layers
except ImportError as e:
    print(f"Error importing job modules: {e}")
    print("Ensure you are running this script with the correct PYTHONPATH or from the correct directory.")
    sys.exit(1)

def run_pipeline():
    print("="*60)
    print("STARTING DATA UPDATE PIPELINE")
    print("="*60)
    start_time = time.time()

    # Step 1: Update Map Layers (WFS Data)
    print("\n[STEP 1] Syncing full WFS layer cache...")
    try:
        sync_wfs_layers.main()
    except Exception as e:
        print(f"Warning in Step 1: {e}")
        # Proceed with the rest of the pipeline even if WFS sync fails.

    # Step 2: Download Index Plan PDFs
    print("\n[STEP 2] Downloading Index Plan PDFs...")
    try:
        download_index_plan.download_and_extract()
    except Exception as e:
        print(f"FATAL ERROR in Step 2: {e}")
        sys.exit(1)

    # Step 3: Convert PDFs to Whole Page SVGs
    print("\n[STEP 3] Converting PDFs to Whole Page SVGs...")
    try:
        convert_whole_pdf_to_svg.convert_all_pdfs()
    except Exception as e:
        print(f"FATAL ERROR in Step 3: {e}")
        sys.exit(1)

    # Step 4: Extract Individual Signs and Generate JSON
    print("\n[STEP 4] Extracting Individual Signs and Generating JSON...")
    try:
        extract_svgs_viewbox.process_all_svgs()
    except Exception as e:
        print(f"FATAL ERROR in Step 4: {e}")
        sys.exit(1)

    # Step 5: Export Last Run Time
    print("\n[STEP 5] Exporting Last Run Time...")
    try:
        import json
        from datetime import datetime
        last_run_data = {
            "lastRun": datetime.now().strftime("%Y-%m-%d")
        }
        # Output to public folder
        output_path = os.path.join(current_dir, "..", "public", "lastRun.json")
        with open(output_path, "w") as f:
            json.dump(last_run_data, f)
        print(f"Exported last run time to {output_path}")
    except Exception as e:
        print(f"Warning in Step 5: {e}")
        
    elapsed = time.time() - start_time
    print("\n" + "="*60)
    print(f"PIPELINE COMPLETED SUCCESSFULLY in {elapsed:.2f} seconds")
    print("="*60)

if __name__ == "__main__":
    run_pipeline()
