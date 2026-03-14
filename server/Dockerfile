# Node + postgresql-client for pg_dump/pg_restore (tenant provisioning on Neon)
FROM node:18-slim

RUN apt-get update && apt-get install -y postgresql-client \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["node", "server.js"]
