FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 1935
EXPOSE 8000
EXPOSE 8443
CMD ["node", "server.js"]
