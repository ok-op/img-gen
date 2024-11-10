# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and install dependencies
COPY package.json ./
RUN npm install

# Step 4: Copy the rest of the app's code
COPY . .

# Step 5: Expose the port the app will run on
EXPOSE 3000

# Step 6: Define the command to run the app
CMD ["node", "app.js"]
