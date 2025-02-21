import React, { useState } from 'react';
import './XrayCheck.css'; 
import "./App.css"


const UploadComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  
  return (
    <div className='transparent-square'>
    <div className="upload-container">
      <div className="upload-box">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={styles.input}
        id="upload-button"
      />
      <label htmlFor="upload-button" style={styles.button}>
        Upload Image
      </label>
        </div>
          <div className="result-box">
          { selectedImage && (
            <div style={styles.preview}>
              <img src={selectedImage} alt="Selected" style={styles.image} />
            </div>
          )}      
        </div>
    </div>
    </div>
  );

  
};

const styles = {
  container: {
    textAlign: 'center',
    margin: '20px',
  },
  input: {
    display: 'none',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  preview: {
    marginTop: '20px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default UploadComponent;
