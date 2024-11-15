# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy cookies.txt if needed
COPY cookies.txt /app/cookies.txt
COPY downloads /app/downloads

# Expose port 3000
EXPOSE 3000

# Run the Flask app when the container starts
CMD ["python", "bot.py"]

