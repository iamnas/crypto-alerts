# # 1️⃣ Build Stage
# FROM node:20-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Install pnpm globally
# RUN npm install -g pnpm

# # Copy package.json and lockfile
# COPY package.json pnpm-lock.yaml ./

# # Install dependencies
# RUN pnpm install --frozen-lockfile

# # Copy the whole application
# COPY . .

# # Generate Prisma client
# RUN pnpm prisma generate

# # Build the NestJS app
# RUN pnpm run build

# # 2️⃣ Production Stage
# FROM node:20-alpine AS runner

# # Set working directory
# WORKDIR /app

# # Install pnpm (needed for runtime)
# RUN npm install -g pnpm

# # Copy only the necessary files from builder
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/package.json ./

# # Set environment
# ENV NODE_ENV=production

# # Expose port
# EXPOSE 3000

# # Start the app
# CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main.js"]


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
