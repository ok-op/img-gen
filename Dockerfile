# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp
RUN apt-get update && \
    apt-get install -y --no-install-recommends yt-dlp && \
    rm -rf /var/lib/apt/lists/*

# Create a downloads directory with necessary permissions
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Expose the port Flask will run on
EXPOSE 3000

# Health check endpoint for faster deployment
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD curl -f http://localhost:3000/health || exit 1

# Command to run the Flask app
CMD ["python", "bot.py"]
