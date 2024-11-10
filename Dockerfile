# Use an official Python image as a base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp
RUN apt-get update && apt-get install -y yt-dlp

# Ensure yt-dlp has executable permissions
RUN chmod +x /usr/local/bin/yt-dlp

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Python app
CMD ["python", "bot.py"]
