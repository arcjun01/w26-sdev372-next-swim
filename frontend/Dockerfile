# Stage 1: build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# 1. Install dependencies with legacy support for React 19/Testing Library 14 conflicts
RUN npm install --legacy-peer-deps

# 2. Force rebuild of esbuild to match the Linux container architecture
RUN npm rebuild esbuild

COPY . .

# 3. RUN FRONTEND UNIT TESTS (Vitest)
# The --run flag ensures it runs once and exits rather than watching for changes
RUN npm test -- --run

# 4. Build the production application
RUN npm run build

# Stage 2: serve
FROM nginx:alpine

# Copy built frontend from build stage to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Default Nginx port is 80, but your compose maps to 5173
EXPOSE 80

# Print link and start nginx
CMD sh -c 'echo ">~~~~~~~~~~~Frontend: http://localhost:5173 ~~~~~~~~~~~<" && nginx -g "daemon off;"'