import fitz
import os

pdf_path = "Plot no 1.pdf"
output_dir = "assets"
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
for i in range(len(doc)):
    page = doc.load_page(i)
    pix = page.get_pixmap(dpi=150) # High quality render
    pix.save(os.path.join(output_dir, f"page-{i+1}.png"))

print(f"Successfully extracted {len(doc)} pages as high-quality images to the 'assets' folder.")
