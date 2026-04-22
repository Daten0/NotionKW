FROM oven/bun:1-alpine

WORKDIR /app

# Install dependencies (termasuk devDependencies untuk TS types)
COPY package.json ./
RUN bun install --frozen-lockfile || bun install

COPY . .

EXPOSE 3001

# Bun bisa menjalankan .ts secara native tanpa perlu compile step
CMD ["bun", "run", "src/index.ts"]