# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Step 4: Copy the yt-dlp binary from your GitHub repo into the container's app directory
COPY yt-dlp /app/yt-dlp

# Step 5: Give yt-dlp execute permissions
RUN chmod +x /app/yt-dlp

# Step 6: Copy the rest of the app's code
COPY . .

# Step 7: Expose the port the app will run on
EXPOSE 3000

# Step 8: Define the command to run the app
CMD ["node", "index.js"]
