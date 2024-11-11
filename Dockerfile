# Use a smaller Python runtime image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy only the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp and set executable permissions in a single RUN command to optimize the image size
RUN apt-get update && \
    apt-get install -y yt-dlp && \
    rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Now copy the rest of the code
COPY . .

# Create a downloads directory if needed
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Set environment variables for Flask
ENV FLASK_ENV=production
ENV FLASK_APP=bot.py

# Expose the port Flask will run on
EXPOSE 3000

# Command to run the Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=3000"]
