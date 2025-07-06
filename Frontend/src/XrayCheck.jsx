import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import Link from '@mui/material/Link';

const BoneXPreviewer = () => {
  // State for managing images and UI
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [loadedImage, setLoadedImage] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewSnackbar, setReviewSnackbar] = useState({ open: false, message: '' });
 const navigate = useNavigate();
  // Refs for DOM elements
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Authentication token and role from session storage
  const token = JSON.parse(sessionStorage.getItem('userInfo'))?.token;
  const role = JSON.parse(sessionStorage.getItem('userInfo'))?.role;

  // Constants for file validation
  const VALID_TYPES = ['image/jpeg', 'image/png'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  // Current selected image
  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  // Canvas setup effect
  useEffect(() => {
    if (!selectedImage || !containerRef.current || !canvasRef.current) return;
    
    const { clientWidth, clientHeight } = containerRef.current;
    canvasRef.current.width = clientWidth;
    canvasRef.current.height = clientHeight;

    const img = new Image();
    img.src = selectedImage.previewUrl;
    img.onload = () => {
      setLoadedImage(img);
      const ctx = canvasRef.current.getContext('2d');
      const canvasRatio = clientWidth / clientHeight;
      const imgRatio = img.width / img.height;
      
      let drawWidth, drawHeight;
      if (imgRatio > canvasRatio) {
        drawWidth = clientWidth;
        drawHeight = clientWidth / imgRatio;
      } else {
        drawHeight = clientHeight;
        drawWidth = clientHeight * imgRatio;
      }
      
      const offsetX = (clientWidth - drawWidth) / 2;
      const offsetY = (clientHeight - drawHeight) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
  }, [selectedImage]);

  // Resize effect
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current || !loadedImage) return;
      
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      
      const ctx = canvasRef.current.getContext('2d');
      const canvasRatio = clientWidth / clientHeight;
      const imgRatio = loadedImage.width / loadedImage.height;
      
      let drawWidth, drawHeight;
      if (imgRatio > canvasRatio) {
        drawWidth = clientWidth;
        drawHeight = clientWidth / imgRatio;
      } else {
        drawHeight = clientHeight;
        drawWidth = clientHeight * imgRatio;
      }
      
      const offsetX = (clientWidth - drawWidth) / 2;
      const offsetY = (clientHeight - drawHeight) / 2;
      ctx.drawImage(loadedImage, offsetX, offsetY, drawWidth, drawHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadedImage]);

  // File validation
  const validateFile = useCallback((file) => {
    if (!VALID_TYPES.includes(file.type)) {
      setSnackbar({
        open: true,
        message: 'Only JPEG and PNG images are allowed.',
        severity: 'error',
      });
      return false;
    }
    if (file.size > MAX_SIZE) {
      setSnackbar({
        open: true,
        message: 'File size exceeds 5MB limit.',
        severity: 'error',
      });
      return false;
    }
    return true;
  }, []);

  // Handle file upload
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      const newImage = {
        file,
        previewUrl: URL.createObjectURL(file),
        result: null,
        id: Date.now() + Math.random(),
      };
      setImages((prev) => {
        const updated = [...prev, newImage];
        setSelectedIndex(updated.length - 1);
        return updated;
      });
    }
    fileInputRef.current.value = '';
  }, [validateFile]);

  // Get display message for analysis result
  const getDisplayMessage = (prediction) => {
    if (!prediction) return { message: 'No analysis available.', severity: 'info' };
    const lowerPred = prediction.toLowerCase();
    if (lowerPred.includes('no fracture')) {
      return { message: 'Good news, there is no fracture.', severity: 'success' };
    } else if (lowerPred.includes('fracture')) {
      return { message: 'Warning: A fracture has been detected.', severity: 'error' };
    }
    return { message: 'Analysis result: ' + prediction, severity: 'info' };
  };

  // Analyze image
  const handleAnalyze = useCallback(async () => {
    if (selectedIndex === null || !images[selectedIndex]) {
      setSnackbar({
        open: true,
        message: 'No image selected for analysis.',
        severity: 'warning',
      });
      return;
    }

    if (!token) {
      setSnackbar({
        open: true,
        message: 'Authentication required. Please log in.',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('XrayImage', images[selectedIndex].file);

    try {
      const response = await fetch('https://bonex.runasp.net/Xray/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('data',data);
        
        const aiResult =
          data.aiAnalysisResult || '{"prediction":"Analysis completed - no specific findings"}';
        const result = JSON.parse(aiResult);
        console.log('result',result);
        

        // Add timestamp to the result
        setImages((prev) => {
          const updated = [...prev];
          updated[selectedIndex] = { 
            ...updated[selectedIndex], 
            result,
            analyzedAt: new Date().toISOString()  // Add timestamp here
          };
          return updated;
        });

        const { message, severity } = getDisplayMessage(result.prediction);
        setSnackbar({ open: true, message, severity });
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedIndex, images, token]);

const handleGoToDoctors = () => {
  navigate('/doctorsv1');

}

  // Delete image
  const handleDelete = useCallback(
    (index) => {
      setImages((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        URL.revokeObjectURL(prev[index].previewUrl);

        if (selectedIndex === index) setSelectedIndex(null);
        else if (selectedIndex > index) setSelectedIndex(selectedIndex - 1);
        return updated;
      });
    },
    [selectedIndex]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    const newImages = Array.from(files)
      .filter(validateFile)
      .map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        result: null,
        id: Date.now() + Math.random(),
      }));

    if (newImages.length > 0) {
      const newLength = images.length + newImages.length;
      setImages((prev) => [...prev, ...newImages]);
      setSelectedIndex(newLength - 1);
    }
  }, [images.length, validateFile]);

  // Drawing handlers
  const handleMouseDown = useCallback((e) => {
    if (
      !canvasRef.current ||
      !selectedImage?.result ||
      getDisplayMessage(selectedImage.result.prediction).severity !== 'error'
    )
      return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setIsDrawing(true);
  }, [selectedImage]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || !canvasRef.current || !loadedImage) return;
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear canvas and redraw image
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const { clientWidth, clientHeight } = containerRef.current;
    const canvasRatio = clientWidth / clientHeight;
    const imgRatio = loadedImage.width / loadedImage.height;
    let drawWidth, drawHeight;
    if (imgRatio > canvasRatio) {
      drawWidth = clientWidth;
      drawHeight = clientWidth / imgRatio;
    } else {
      drawHeight = clientHeight;
      drawWidth = clientHeight * imgRatio;
    }
    const offsetX = (clientWidth - drawWidth) / 2;
    const offsetY = (clientHeight - drawHeight) / 2;
    ctx.drawImage(loadedImage, offsetX, offsetY, drawWidth, drawHeight);

    // Draw circle
    const dx = x - startPos.x;
    const dy = y - startPos.y;
    const radius = Math.sqrt(dx * dx + dy * dy);
    ctx.beginPath();
    ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [isDrawing, loadedImage, startPos]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Send annotated image
  const handleSendReview = useCallback(async () => {
    if (!canvasRef.current) return;
    
    setReviewModalOpen(false); // Close the modal when submitting
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'annotated.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('annotatedImage', file);
    formData.append('reviewText', reviewText); // Add the review text

    try {
      const response = await fetch('https://bonex.runasp.net/Xray/review', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (response.ok) {
        // Show blue success notification
        setReviewSnackbar({
          open: true,
          message: 'Review submitted successfully'
        });
        setReviewText(''); // Clear review text
      } else {
        throw new Error('Failed to send review');
      }
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    }
  }, [token, reviewText]);

  return (
    <Box sx={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Box
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff',
          border: isDragging ? '2px dashed #1976d2' : '2px dashed transparent',
        }}
      >
        {images.length === 0 ? (
          // Welcome Screen
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
              Upload an image to detect fracture
            </Typography>
            <Button
              variant="contained"
              sx={{
                fontSize: '1.125rem',
                px: 4,
                py: 1.75,
                borderRadius: '9999px',
                transition: 'transform 0.3s ease',
                mb: 2,
                '&:hover': { transform: 'scale(1.05)' },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Image
            </Button>
            <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
              or drop a file
            </Typography>
          </Box>
        ) : (
          <>
            {selectedImage && (
              // Canvas for Image Display and Drawing
              <div ref={containerRef} style={{ width: '90vw', height: '80vh', position: 'relative' }}>
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%' }}
                  onMouseDown={
                    selectedImage?.result &&
                    getDisplayMessage(selectedImage.result.prediction).severity === 'error'
                      ? handleMouseDown
                      : undefined
                  }
                  onMouseMove={
                    selectedImage?.result &&
                    getDisplayMessage(selectedImage.result.prediction).severity === 'error'
                      ? handleMouseMove
                      : undefined
                  }
                  onMouseUp={
                    selectedImage?.result &&
                    getDisplayMessage(selectedImage.result.prediction).severity === 'error'
                      ? handleMouseUp
                      : undefined
                  }
                />
                {loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    }}
                  >
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Processing image...
                    </Typography>
                  </Box>
                )}
              </div>
            )}
          </>
        )}
      </Box>

      {/* Analysis Result Panel (Top Right) */}
      <Collapse 
        in={!!selectedImage?.result}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1,
          width: '320px',
        }}
      >
        {selectedImage?.result && (() => {
          const { message, severity } = getDisplayMessage(selectedImage.result.prediction);
          
          // Format the timestamp
          const timestamp = selectedImage.analyzedAt 
            ? new Date(selectedImage.analyzedAt).toLocaleString() 
            : 'Just now';
            
          return (
           <Box
  sx={{
    p: 3,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: 'center',
    bgcolor: { success: 'success.light', error: 'error.light', info: 'info.light' }[severity],
    border: '1px solid',
    borderColor: { success: 'success.main', error: 'error.main', info: 'info.main' }[severity],
  }}
>
  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
    Analysis Result
  </Typography>

  <Typography variant="body1" sx={{ mt: 1 }}>
    {message}
  </Typography>

  {message === "Warning: A fracture has been detected." && (
    <Typography hidden={role === "Doctor"} variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
      We suggest you visit a doctor.
    </Typography>
  )}

  <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
    Analyzed at: {timestamp}
  </Typography>
          </Box>

          );
        })()}
      </Collapse>

      {/* Controls */}
      {selectedImage && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 150,
            right: 20,
            display: 'flex',
            gap: 2,
            bgcolor: 'white',
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            zIndex: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: '9999px',
              px: 3,
              py: 1.25,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={handleAnalyze}
            disabled={loading}
          >
            Analyze
          </Button>
          
          {role!=="Doctor"&&selectedImage?.result?.prediction==="there's a fracture!"&&(
          <Button
            variant="contained"
            sx={{
              borderRadius: '9999px',
              px: 3,
              py: 1.25,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={handleGoToDoctors}
          
          >
            Book An Appointment?
          </Button>
          )}
          {/* Fixed role check - removed unnecessary condition */}
          {role === "Doctor" && selectedImage?.result?.prediction && 
             (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: '9999px',
                px: 3,
                py: 1.25,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
              onClick={() => setReviewModalOpen(true)}
            >
              Send Review
            </Button>
          )}
        </Box>
      )}

      {/* Review Submission Modal */}
      <Dialog open={reviewModalOpen} onClose={() => setReviewModalOpen(false)}>
        <DialogTitle>Submit Review</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide additional comments about the fracture:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Your review"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendReview}
            variant="contained"
            disabled={!reviewText.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thumbnail Strip */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          display: 'flex',
          gap: 1,
          p: 1,
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          overflowX: 'auto',
        }}
      >
        <Box
          component="label"
          sx={{
            width: 100,
            height: 100,
            bgcolor: '#e0e7ff',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#c7d2fe' },
            flexShrink: 0,
          }}
        >
          <AddIcon color="primary" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            hidden
            onChange={handleFileChange}
          />
        </Box>
        {images.map((img, i) => (
          <Box key={img.id} sx={{ position: 'relative', flexShrink: 0 }}>
            <Box
              onClick={() => setSelectedIndex(i)}
              sx={{
                width: 100,
                height: 100,
                border: i === selectedIndex ? '2px solid #1976d2' : '2px solid transparent',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': { borderColor: '#1976d2' },
              }}
            >
              <img
                src={img.previewUrl}
                alt={`Thumbnail ${i}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {img.result && (
                <CheckIcon
                  sx={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    color: 'green',
                  }}
                />
              )}
            </Box>
            <IconButton
              size="small"
              sx={{ 
                position: 'absolute', 
                top: -10, 
                right: -10, 
                bgcolor: 'white',
                '&:hover': { bgcolor: '#ffebee' }
              }}
              onClick={() => handleDelete(i)}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Blue Success Notification for Review Submission */}
      <Snackbar
        open={reviewSnackbar.open}
        autoHideDuration={4000}
        onClose={() => setReviewSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setReviewSnackbar({ open: false, message: '' })}
          severity="info"
          sx={{ 
            backgroundColor: '#e3f2fd', 
            color: '#1976d2',
            '& .MuiAlert-icon': { color: '#1976d2' }
          }}
        >
          {reviewSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BoneXPreviewer;