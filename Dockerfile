# Stage 1: Install dependencies
FROM node:20.19.5-slim AS deps
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application (using full node for build stability)
FROM node:20.19.5 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables (Full sync from Portainer UI)
ARG PORT
ARG NODE_ENV
ARG JWT_SECRET
ARG SQLITE_DB_PATH
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_IS_DEBUG

ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
ENV JWT_SECRET=$JWT_SECRET
ENV SQLITE_DB_PATH=$SQLITE_DB_PATH
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_IS_DEBUG=$NEXT_PUBLIC_IS_DEBUG

# Ensure database directory exists during build time
RUN mkdir -p data
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1
# Build the application with increased RAM limit
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Stage 3: Runner
FROM node:20.19.5-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up data directory for SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Copy necessary files for standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# IMPORTANT: Restore full node_modules AFTER standalone extraction
# This ensures that drizzle-kit and drizzle-orm are always available at the root level
COPY --from=deps /app/node_modules ./node_modules

# Copy scripts and migrations for database initialization
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh ./entrypoint.sh

# Ensure entrypoint is executable
RUN chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]
