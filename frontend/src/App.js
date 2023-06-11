import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [fontSize, setFontSize] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleExcelUpload = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleFSChange = (e) => {
    setFontSize(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !excelFile || !fontSize) {
      alert('Please upload both an image and an Excel file and select the font size if you havent.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('excel', excelFile);
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
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while processing the files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Files</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Image File:</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div>
          <label htmlFor="excel">Excel File:</label>
          <input type="file" id="excel" accept=".xlsx, .xls" onChange={handleExcelUpload} />
        </div>
        <div>
          <label htmlFor="font_size">Font Size:</label>
          <input type="number" id="font_size" name="font_size" min="1" max="999" onChange={handleFSChange} />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Generate Certificates'}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default App;
