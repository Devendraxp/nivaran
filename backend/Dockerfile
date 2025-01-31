FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Add --legacy-peer-deps flag to resolve dependency conflicts
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]