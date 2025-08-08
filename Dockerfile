# Use an official nodejs runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package.locl.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app is running on
EXPOSE 5000

# Define the command to run our application
CMD ["node", "./src/server.js"]