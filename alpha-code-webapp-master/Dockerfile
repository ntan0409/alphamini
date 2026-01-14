# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN yarn install --frozen-lockfile || npm install

COPY . .
RUN yarn build || npm run build

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/next.config.js ./
# Copy public from build context directly to ensure static assets are included even if the builder
# stage didn't preserve them. This avoids errors when /app/public is missing in the builder image.
## Copy public assets from the builder stage where they actually exist under /app/src/public
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
