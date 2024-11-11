# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy only requirements.txt to leverage Docker cache
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp using pip instead of apt-get (avoids unnecessary apt-get install)
RUN pip install --no-cache-dir yt-dlp

# Copy the rest of the application code
COPY . .

# Set permissions for downloads directory
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Set environment variables for Flask
ENV FLASK_ENV=production
ENV FLASK_APP=bot.py

# Expose the port Flask will run on
EXPOSE 3000

# Command to run the Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=3000"]
