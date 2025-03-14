FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gdown flask-cors opencv-python keras

# Copy application code
COPY . .

# Download the model during build
RUN python -c "import gdown; gdown.download('https://drive.google.com/uc?id=1ZwS3XGujLt2z6XoaDJ_7DTW7UG-bMA3m', 'BoneX_Final_ModelV4.h5', quiet=False)"

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["python", "main.py"]