# Use a lightweight Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp directly with pip
RUN pip install --no-cache-dir yt-dlp

# Copy the rest of the application code
COPY . .

# Ensure necessary permissions on downloads folder
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Expose the port Flask will run on
EXPOSE 3000

# Command to run the Flask app
CMD ["python", "bot.py"]
