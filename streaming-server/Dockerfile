# Dockerfile for Streaming Server
FROM node:14

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1935
EXPOSE 8000
EXPOSE 8443

CMD ["node", "server.js"]