import React, { useEffect, useState } from 'react';
import './XrayCheck.css'; 
import './App.css';

const UploadComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [token, settoken] = useState( JSON.parse(sessionStorage.getItem('userInfo')).token);
 


const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };



  useEffect(() => {
  
    
    

console.log('the token =',token);

   
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    // Create a temporary preview URL
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    // Automatically upload the image as soon as it is selected
    const uploadImage = async () => {
      const formData = new FormData();

      
      formData.append('XrayImage', selectedImage);
      

      try {
        const response = await fetch('http://bonex.runasp.net/Xray/upload', {
          method: 'POST',
          headers: {
            
            
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        // Parse the JSON response body
        const responseBody = await response.json();
        console.log('Parsed response body:', (responseBody));

        if (response.ok) {
          setUploadStatus(`Upload successful: ${responseBody.aiAnalysisResult!==null ? responseBody.aiAnalysisResult : 'No result'}`);
        } else {
          setUploadStatus(`Upload failed with status: ${response.status} - ${responseBody.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus('Error uploading file.');
      }
    };

    uploadImage();

    // Clean up the object URL when the component unmounts or a new file is chosen
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  return (
    <div className="transparent-square">
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
          {previewUrl && (
            <div style={styles.preview}>
              <img src={previewUrl} alt="Selected" style={styles.image} />
            </div>
          )}
          {uploadStatus && <p>{uploadStatus}</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
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
