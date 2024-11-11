# Use an official Python runtime as a base image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Install Gunicorn for production
RUN pip install gunicorn

# Install yt-dlp and set executable permissions
RUN apt-get update && apt-get install -y yt-dlp && chmod +x /usr/local/bin/yt-dlp

# Create a downloads directory
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Set environment variables for Flask
ENV FLASK_ENV=production
ENV FLASK_APP=bot.py

# Expose the port Flask will run on
EXPOSE 3000

# Command to run the Flask app
# CMD ["flask", "run", "--host=0.0.0.0", "--port=3000"]

# Command to run the Flask app with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:3000", "bot:app"]



# Run the Flask application
# CMD ["python", "bot.py"]
