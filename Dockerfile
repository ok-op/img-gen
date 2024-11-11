# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy only the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp and set executable permissions
RUN apt-get update && apt-get install -y yt-dlp && rm -rf /var/lib/apt/lists/*

# Now copy the rest of the code
COPY . .

# Create a downloads directory
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Expose the port Flask will run on
EXPOSE 3000

# Command to run the Flask app
CMD ["python", "bot.py"]
