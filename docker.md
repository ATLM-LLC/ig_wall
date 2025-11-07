# Docker Setup for Instagram Gallery Aggregator

This file contains all the necessary configurations to run the frontend application using Docker and Docker Compose. Copy the contents of each section into a new file with the specified name in the root of your project.

---

### 1. `Dockerfile` (Production Ready)

This file defines a multi-stage container image build. It first builds the React app inside a Node.js environment, then copies the final static files into a lightweight Nginx server for serving. This creates a small and secure production image.

```Dockerfile
# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy the built assets from the 'build' stage
# The output of 'npm run build' is in the 'dist' folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
```

---

### 2. `docker-compose.yml`

This file makes it easy to build and run the application with a single command (`docker-compose up`).

```yaml
version: '3.8'

services:
  frontend:
    # Build the image from the Dockerfile in the current directory
    build: .
    container_name: instagram_gallery_frontend
    ports:
      # Map port 8080 on the host to port 80 in the container
      - "8080:80"
    restart: unless-stopped
    # The 'env_file' directive is where you would link your .env file
    # for a backend service. Nginx doesn't use it, but it's good practice.
    # env_file:
    #   - .env

networks:
  default:
    name: instagram-gallery-net
```

---

### 3. `.env.example`

This file is a template for all the environment variables your application will need. Copy this to a `.env` file and fill in your actual secrets. **Do not commit your `.env` file to version control.**

```env
# --- Frontend Environment Variables ---
# These need to be exposed to your Vite build process.
# Prefix them with VITE_ to make them available in your code (e.g., import.meta.env.VITE_INSTAGRAM_APP_ID)
VITE_INSTAGRAM_APP_ID="YOUR_INSTAGRAM_APP_ID"
VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"

# --- Backend Environment Variables (For your future server) ---
# These MUST be kept secret on your server and never exposed to the frontend.

# Instagram API Credentials
INSTAGRAM_APP_SECRET="YOUR_INSTAGRAM_APP_SECRET"

# Your application's redirect URI (must match the one in your app settings)
INSTAGRAM_REDIRECT_URI="http://localhost:8080"
GOOGLE_REDIRECT_URI="http://localhost:8080"

# Admin Authorization
# A comma-separated list of Google email addresses allowed to access the admin panel.
AUTHORIZED_ADMIN_EMAILS="admin1@example.com,admin2@example.com"

# Session Secret for Admin Login
SESSION_SECRET="a_very_long_and_random_string_for_securing_sessions"

# Database Connection URL (if you add a database later)
# Example for PostgreSQL: DATABASE_URL="postgresql://user:password@host:port/database"
# Example for SQLite: DATABASE_URL="file:./dev.db"
```

---

### 4. `nginx.conf`

This is a basic Nginx configuration. The `try_files` directive is essential for Single Page Applications (SPAs). It ensures that if a user reloads the page on a path like `/admin`, the server returns `index.html` instead of looking for an `/admin` file, allowing your frontend router to take over.

```nginx
server {
    listen 80;
    server_name localhost;

    # The root directory where your static files are served from
    root /usr/share/nginx/html;

    # The default file to serve
    index index.html;

    location / {
        # This is the key for Single Page Applications (SPAs)
        # It tries to find a file with the exact name ($uri),
        # then a directory with that name ($uri/),
        # and if neither exists, it falls back to serving /index.html.
        # This allows your client-side router to handle all the routes.
        try_files $uri $uri/ /index.html;
    }

    # Optional: Add headers to prevent caching issues
    location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```