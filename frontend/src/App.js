import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [fontFile, setFontFile] = useState(false);
  const [fontSize, setFontSize] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {  
    const file = e.target.files[0];
    const maxSize = 20 * 1024 * 1024; // 20MB
  
    if (file && file.size > maxSize) {
      setImageFile(null);
      window.location.reload(false)
      alert('Image size exceeds the maximum limit of 20MB.');
    } else {
      setImageFile(file);
    }
  };

  const handleExcelUpload = (e) => {  
    const file = e.target.files[0];
    const maxSize = 4 * 1024 * 1024; // 20MB
  
    if (file && file.size > maxSize) {
      setImageFile(null);
      window.location.reload(false)
      alert('Excel size exceeds the maximum limit of 4MB.');
    } else {
      setImageFile(file);
    }
  };

  const handleFontFileUpload = (e) => {  
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 20MB
  
    if (file && file.size > maxSize) {
      setImageFile(null);
      window.location.reload(false)
      alert('Font File size exceeds the maximum limit of 2MB.');
    } else {
      setImageFile(file);
    }
  };

  const handleFSChange = (e) => {
    setFontSize(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !excelFile || !fontSize) {
      alert('Please upload an image, an Excel file, and select the font size.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('excel', excelFile);
      
      if (fontFile !== false) {
        formData.append('font_file', fontFile);
      }

      formData.append('font_size', fontSize);

      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'certificates.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setError(null);
      
    } catch (e) {
      console.log(e);
      setError('An error occurred while processing the files. Please try again.');
    } finally {
      setLoading(false);
      window.location.reload(false);
    }
  };

  return (
    <div className='App'>
      <div className='form'>
      <h1>Upload Files</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='title_label'>Upload Image File:</label>
          <label htmlFor="image" className="upload-btn">Browse Files</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageUpload} /><br />
          <span className="file-name">{imageFile && imageFile.name}</span>
        </div>
        <div><br />
          <label className='title_label'>Upload Excel File<br />Excel file should only have one column named specifically "Name"</label>
          <label htmlFor="excel" className="upload-btn">Browse Files</label>
          <input type="file" id="excel" accept=".xlsx, .xls" onChange={handleExcelUpload} /> <br />
          <span className="file-name">{excelFile && excelFile.name}</span>
        </div>
        <div>
        <br /><label htmlFor="font_file">Upload Font File: <br />Default: "Montserrat Black" if no font file is uploaded</label><br />
          <input type="file" id="font_file" accept=".ttf" onChange={handleFontFileUpload} />
        </div>
        <div>
        <br /><label htmlFor="font_size">Enter Font Size ( 1 to 999 ) </label><br /> 
          <input type="number" id="font_size" min="1" max="999" onChange={handleFSChange} />
        </div>
        <button className="submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Generate'}
        </button>
        {error && <p>{error}</p>}
      </form>
      </div>
    </div>
  );
}

export default App;
