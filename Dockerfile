# --- Multi-stage Dockerfile Optimized for Production ---
# 1. Base image for building
FROM node:20-slim AS builder

WORKDIR /app

# Install native build tools for better-sqlite3 (only in builder)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install all dependencies (including devDeps for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --- SIZE OPTIMIZATION ---
# 1. Prune devDependencies
RUN npm prune --omit=dev
# 2. DELETE THE MASSIVE BUILD CACHE (gigabytes of tracing)
RUN rm -rf .next/cache

# --- 2. Production Runner image ---
FROM node:20-slim AS runner

WORKDIR /app

# We don't need build tools here, keep it slim
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs

# Copy only the necessary files for the runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

# Permissions and data directory
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app && \
    chmod +x entrypoint.sh

USER nextjs

EXPOSE 3000

# Entrypoint using Standard Mode (npm start)
ENTRYPOINT ["./entrypoint.sh"]
