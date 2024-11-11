# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install necessary packages
RUN pip install --no-cache-dir -r requirements.txt

# Install Gunicorn for production
RUN pip install --no-cache-dir gunicorn

# Install yt-dlp and set executable permissions
RUN apt-get update && apt-get install -y --no-install-recommends yt-dlp && rm -rf /var/lib/apt/lists/*

# Create a downloads directory with full permissions
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Set environment variables for Flask
ENV FLASK_ENV=production
ENV FLASK_APP=bot.py

# Expose the port Flask will run on
EXPOSE 3000

# Command to run the Flask app with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:3000", "bot:app"]
