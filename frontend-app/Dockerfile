# Use the official Node.js image as the build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Use the official Node.js runtime image for the final stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies  
RUN npm ci --only=production && npm cache clean --force

# Copy the built application from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.js ./next.config.js
# If public directory exists, copy it
RUN mkdir -p ./public

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Run the application
CMD ["npm", "start"]
