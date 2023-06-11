from flask import Flask, request, jsonify, make_response
from werkzeug.utils import secure_filename
import os
from PIL import Image, ImageDraw, ImageFont
import io
import pandas as pd
import zipfile

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'xlsx', 'xls', '.ttf'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_image(size, message, font, fontColor, image):
    W, H = size
    draw = ImageDraw.Draw(image)
    _, _, w, h = draw.textbbox((0, 0), message, font=font)
    
    max_width = W * 0.8  
    if w > max_width:
        new_font_size = int(font.size * max_width / w)
        font = font.font_variant(size=new_font_size)
        _, _, w, h = draw.textbbox((0, 0), message, font=font)
    
    draw.text(((W-w)/2, (H-h)/2), message, font=font, fill=fontColor)
    return image

@app.route('/upload', methods=['POST'])
def upload_files():
    image_file = request.files['image']
    excel_file = request.files['excel']
    font_file = request.files['font']
    font_size = int(request.form['font_size'])

    if image_file and allowed_file(image_file.filename) and excel_file and allowed_file(excel_file.filename):

        if font_file and allowed_file(font_file.filename):
            font_filename = secure_filename(font_file.filename)
            font_file_path = os.path.join(app.config['UPLOAD_FOLDER'], font_filename)
            font_file.save(font_file_path)
        
        else:
            font_file_path = os.path.join("", "default_font.tff")

        image_filename = secure_filename(image_file.filename)
        excel_filename = secure_filename(excel_file.filename)
        
        image_file_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        excel_file_path = os.path.join(app.config['UPLOAD_FOLDER'], excel_filename)

        image_file.save(image_file_path)
        excel_file.save(excel_file_path)
        
        image = Image.open(image_file_path)
        image_width, image_height = image.size

        # Generate output images 
        output_images = []
        excel_name = pd.read_excel(excel_file_path)
        name_list = excel_name["Name"].tolist()
        
        for name in name_list:
            im = image.copy()
            text_color = (255, 255, 255)
            size = (image_width, image_height)
            font = ImageFont.truetype(font_file_path, font_size)
            output_img = create_image(size, name, font, text_color, im)
            output_images.append(output_img)

        # Create individual PDFs
        pdf_files = []
        for idx, output_img in enumerate(output_images):
            pdf_buffer = io.BytesIO()
            output_img.save(pdf_buffer, format='PDF')
            pdf_filename = f'certificate_{name_list[idx]}.pdf'
            pdf_files.append((pdf_filename, pdf_buffer.getvalue()))

        # Create a zip file containing the PDFs
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for pdf_filename, pdf_data in pdf_files:
                zip_file.writestr(pdf_filename, pdf_data)

        # Return the zip file as a file attachment
        zip_buffer.seek(0)
        response = make_response(zip_buffer.getvalue())
        response.headers['Content-Type'] = 'application/zip'
        response.headers['Content-Disposition'] = 'attachment; filename=certificates.zip'
        
        os.remove(image_file_path)
        os.remove(excel_file_path)
        os.remove(font_file_path)
        
        return response
    
    return jsonify({'error': 'Invalid file(s) or file extension not allowed.'}), 400

if __name__ == '__main__':
    app.run()
