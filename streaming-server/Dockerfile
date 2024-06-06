# Use the official Node.js image as the base image
FROM node:14

# Install ffmpeg and clean up apt cache to reduce image size
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose ports for the streaming server
EXPOSE 1935
EXPOSE 8000
EXPOSE 8443

# Command to run the application
CMD ["node", "server.js"]