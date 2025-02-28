# Use official Node.js image
FROM node:20-alpine 

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy all project files
COPY . .  

# Build the NestJS app
RUN pnpm run build  

# Start the application
CMD ["pnpm", "start"]
