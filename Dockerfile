# Use full Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Install build tools needed for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first (allows caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the project
COPY . .

# Expose port for dashboard
EXPOSE 3000

# Start bot + dashboard
CMD ["node", "index.js"]
