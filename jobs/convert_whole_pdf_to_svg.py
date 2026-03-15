import fitz  # PyMuPDF
import os
import glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Input directory where PDFs are located
input_dir = os.path.join(BASE_DIR, "data", "Index Plan")
output_dir = os.path.join(BASE_DIR, "data", "whole_pdf_svg")

def convert_all_pdfs():
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Find all PDF files starting with (TS in the input directory
    # Also support flattened structure where filename might be slightly different?
    # Keeping original pattern for now but making it more flexible
    search_pattern = os.path.join(input_dir, "*.pdf")
    pdf_files = glob.glob(search_pattern)

    if not pdf_files:
        print(f"No PDF files found in: {input_dir}")
        return

    print(f"Found {len(pdf_files)} PDF files to process in {input_dir}")

    for pdf_path in pdf_files:
        pdf_filename = os.path.basename(pdf_path)
        # Filter: only process files that look like our index plans if needed
        # But since we control the folder, process all.
        
        print(f"Processing {pdf_filename}...")
        
        try:
            doc = fitz.open(pdf_path)
            # print(f"Opened {pdf_filename} with {len(doc)} pages.")

            for i, page in enumerate(doc):
                # Construct output filename: (TS 101 - 205)_page1.svg
                base_name = os.path.splitext(pdf_filename)[0]
                output_filename = f"{base_name}_page{i+1}.svg"
                output_path = os.path.join(output_dir, output_filename)
                
                # Skip if exists? or overwrite? Overwrite is safer for updates.
                
                print(f"  Converting page {i+1}...")
                svg = page.get_svg_image()
                
                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(svg)
                
                print(f"  Saved {output_path}")

            doc.close()
            print(f"Finished {pdf_filename}")

        except Exception as e:
            print(f"Error processing {pdf_filename}: {e}")

if __name__ == "__main__":
    convert_all_pdfs()

print("All conversions complete.")
