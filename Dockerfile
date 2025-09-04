# Use full Node.js image (not Alpine) to avoid native module build issues
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (omit dev)
RUN npm install --omit=dev

# Copy the rest of the project
COPY . .

# Expose port for dashboard
EXPOSE 3000

# Start bot + dashboard
CMD ["node", "index.js"]
