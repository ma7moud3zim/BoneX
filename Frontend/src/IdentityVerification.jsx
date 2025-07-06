import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IdentityVerification() {
  // Refs & States
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [error, setError] = useState(null);
  const [apiMessage, setApiMessage] = useState('');
  const [faceDetected, setFaceDetected] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [instructionVisible, setInstructionVisible] = useState(true);
  const [referenceFile, setReferenceFile] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Retrieve user ID & profile picture path from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const id = userInfo.id;
  const referencePath = userInfo.profilePicture;

  // Helper function to convert any image blob to JPG format
  const convertToJpg = (blob) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Fill white background (important for transparent images)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPG blob
        canvas.toBlob((jpgBlob) => {
          if (jpgBlob) {
            resolve(jpgBlob);
          } else {
            reject(new Error('Failed to convert image to JPG'));
          }
        }, 'image/jpeg', 0.95);
      };
      
      img.onerror = () => reject(new Error('Failed to load image for conversion'));
      img.src = URL.createObjectURL(blob);
    });
  };

  useEffect(() => {
    if (!id || !referencePath) {
      setError('User info or profile picture not found in sessionStorage.');
      return;
    }

    // Fetch reference image blob and convert to JPG
    (async () => {
      try {
        const resp = await fetch(
          `https://bonex.runasp.net/me/profile-picture/${id}`
        );
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        
        const originalBlob = await resp.blob();
        
        // Convert to JPG format
        const jpgBlob = await convertToJpg(originalBlob);
        
        // Create file with proper JPG extension
        const file = new File([jpgBlob], `profile-${id}.jpg`, {
          type: 'image/jpeg',
        });
        
        setReferenceFile(file);
        console.log('Reference image loaded and converted to JPG:', file.name, file.type);
      } catch (e) {
        console.error('Failed to download/convert reference image', e);
        setError('Failed to load reference image.');
      }
    })();
    
    // Start camera automatically
    startCamera();
    
    // Cleanup stream on unmount
    return () => {
      stopCamera();
    };
  }, [id, referencePath]);

  const startCamera = async () => {
    try {
      setError(null);
      setInstructionVisible(true);
      
      // Stop any existing stream
      if (streamRef.current) {
        stopCamera();
      }

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      
      // Ensure video plays
      videoRef.current.play().catch(err => {
        console.error('Video play error:', err);
        setError('Could not start camera feed. Please try again.');
      });
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access the camera. Please check your permissions and try again.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!cameraActive) {
      setError('Camera is not active. Please start the camera first.');
      return;
    }
    
    if (!referenceFile) {
      setError('Reference image not loaded yet.');
      return;
    }

    try {
      setError(null);
      setApiMessage('');
      setPhotoURL(null);
      setFaceDetected(false);
      setInstructionVisible(false);
      setCapturing(true);

      // Capture photo immediately
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video.videoWidth || !video.videoHeight) {
        throw new Error('Camera feed is not ready');
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Fill white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to JPG blob with high quality
      canvas.toBlob(async (jpgBlob) => {
        if (!jpgBlob) {
          throw new Error('Failed to capture photo as JPG');
        }
        
        // Create file with JPG extension
        const capturedFile = new File([jpgBlob], `captured-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        
        console.log('Photo captured as JPG:', capturedFile.name, capturedFile.type);
        
        const url = URL.createObjectURL(jpgBlob);
        setPhotoURL(url);
        setCapturing(false);
        setFaceDetected(true);
        
        await processPhoto(capturedFile);
      }, 'image/jpeg', 0.95); // High quality JPG
    } catch (err) {
      console.error('Capture error:', err);
      setError(err.message || 'Error capturing photo');
      setCapturing(false);
    }
  };

  const processPhoto = async (capturedFile) => {
    try {
      setProcessing(true);
      setProcessingProgress(0);

      // Simulate progress
      const progId = setInterval(() => {
        setProcessingProgress((p) => {
          const next = p + 5;
          if (next >= 100) {
            clearInterval(progId);
            return 100;
          }
          return next;
        });
      }, 150);

      // Prepare FormData with proper JPG files
      const form = new FormData();
      form.append('Image1', referenceFile);  // Reference JPG file
      form.append('Image2', capturedFile);   // Captured JPG file

      console.log('Sending files:', {
        reference: referenceFile.name,
        referenceType: referenceFile.type,
        captured: capturedFile.name,
        capturedType: capturedFile.type
      });

      // Call verification API
      const resp = await fetch(
        'https://bonex.runasp.net/Face/verify',
        {
          method: 'POST',
          body: form,
        }
      );
      
      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('API error:', resp.status, errorText);
        throw new Error(`API error: ${resp.status} - ${errorText}`);
      }
      
      const result = await resp.json();

      // Brief delay at 100%
      setTimeout(() => {
        console.log('Verification result:', result);
        if (result.match === false) {
          console.log('Face does not match the original image');
          setApiMessage(result.message || 'Face does not match the original image!');
        } else {
          navigate('/homed');
        }
        setProcessing(false);
      }, 1000);
    } catch (e) {
      console.error('Processing error:', e);
      setError(e.message || 'Failed to send images to server.');
      setProcessing(false);
    }
  };

  const resetCapture = () => {
    setPhotoURL(null);
    setError(null);
    setApiMessage('');
    setFaceDetected(false);
    setInstructionVisible(true);
    startCamera();
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
      `}</style>
      <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100 text-gray-800">
        <div
          className="w-full max-w-xl p-8 bg-white shadow-xl rounded-2xl text-center"
          style={{ animation: 'fadeIn 0.5s ease-in-out forwards' }}
        >
          <h2 className="text-3xl font-bold mb-6">Identity Verification</h2>
          <p className="text-lg mb-6">Align your face within the frame for verification.</p>

          <div className="relative w-full h-[60vh] border-2 border-blue-500 rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover filter brightness-110"
              aria-label="Camera preview"
            />
            {photoURL && (
              <img
                src={photoURL}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Captured"
                style={{ animation: 'fadeIn 0.5s ease-in-out forwards' }}
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <div className="w-1/3 h-1/3 border-4 border-dashed border-white rounded-full" />
            </div>
            {instructionVisible && !photoURL && (
              <div
                className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50"
                style={{ animation: 'fadeIn 0.5s ease-in-out forwards' }}
              >
                <p className="text-2xl font-semibold text-white">Align your face within the frame</p>
              </div>
            )}
          </div>

          {faceDetected && (
            <p className="mt-4 text-xl font-medium text-green-500">Photo Captured!</p>
          )}
          {error && <p className="text-red-500 mt-6 text-lg">{error}</p>}
          {apiMessage && <p className="text-green-500 mt-6 text-lg">{apiMessage}</p>}

          {processing && (
            <div className="w-full mt-4">
              <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${processingProgress}%`,
                    transition: 'width 0.15s ease-out',
                  }}
                />
              </div>
              <p className="mt-2 text-lg">Processing: {processingProgress}%</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 items-center">
            {!photoURL && !processing && (
              <>
                <button
                  onClick={startCamera}
                  className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-transform transform hover:scale-105 text-lg"
                >
                  {cameraActive ? 'Restart Camera' : 'Start Camera'}
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!cameraActive || capturing}
                  className={`${cameraActive ? 'bg-[#071952] hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-8 py-3 rounded-full transition-transform transform hover:scale-105 text-lg`}
                >
                  {capturing ? 'Capturing...' : 'Take a Photo'}
                </button>
              </>
            )}
            
            {processing && (
              <div className="flex flex-col items-center mt-4">
                <svg
                  className="animate-spin h-10 w-10 text-teal-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span className="ml-3 text-xl">Processing...</span>
              </div>
            )}
            
            {photoURL && !processing && (
              <button
                onClick={resetCapture}
                className="bg-gray-300 text-gray-800 px-8 py-3 rounded-full hover:bg-gray-400 transition-transform transform hover:scale-105 text-lg"
              >
                Take New Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}