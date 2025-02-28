# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the entire project
COPY . .

# Build the NestJS app
RUN pnpm run build

# Expose the port NestJS will run on
EXPOSE 3000

# Command to start the application
CMD ["pnpm", "run", "start"]
