# Use the official lightweight Node.js image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g serve

# Copy app files
COPY . .

# Expose port
EXPOSE 5173

RUN npm run build

CMD [ "serve", "-s", "dist", "-l", "5173" ]
