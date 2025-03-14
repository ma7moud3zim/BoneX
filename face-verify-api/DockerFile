# Use a more comprehensive base image
FROM python:3.10

# Set the working directory
WORKDIR /app

# Install system dependencies - more comprehensive list
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libfontconfig1 \
    libxkbcommon-x11-0 \
    libxi6 \
    libxrandr2 \
    mesa-utils \
    xvfb \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable to avoid display issues
ENV PYTHONUNBUFFERED=1
ENV DISPLAY=:99

# Copy requirements.txt first (for better caching)
COPY requirements.txt .

# Pin the specific versions and explicitly install OpenCV
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip uninstall -y opencv-python-headless && \
    pip install --no-cache-dir opencv-python-headless==4.8.0.74

# Copy the application code
COPY . .

# Expose the port the app runs on
ENV PORT=8000
EXPOSE 8000

# Create a startup script
RUN echo '#!/bin/bash\nXvfb :99 -screen 0 1024x768x16 &\ngunicorn --bind 0.0.0.0:$PORT main:app' > /app/start.sh && \
    chmod +x /app/start.sh

# Command to run the application
CMD ["/app/start.sh"]