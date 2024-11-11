# Use a smaller Python runtime image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp and other necessary packages in a single layer to optimize build
RUN apt-get update && \
    apt-get install -y yt-dlp && \
    rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Now copy the rest of the code
COPY . .

# Create a downloads directory (only if needed)
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Expose the port Flask will run on
EXPOSE 3000

# Command to run the Flask app
CMD ["python", "bot.py"]
