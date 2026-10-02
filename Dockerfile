# Node.js 18 Alpine Base Image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package descriptors
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production || npm install --production

# Copy application source code
COPY . .

# Expose server port
EXPOSE 3000

# Start application server
CMD ["npm", "start"]

