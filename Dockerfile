# Stage 1: Build
FROM mcr.microsoft.com/playwright:v1.57.0-noble-amd64 AS builder

WORKDIR /app

# Copiar arquivos de configuração e dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN npm install -g pnpm
RUN pnpm install

# Copiar código fonte
COPY src ./src
COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

# Build do projeto
RUN pnpm run build

# Stage 2: Runtime
FROM mcr.microsoft.com/playwright:v1.57.0-noble-amd64

WORKDIR /app

# Copiar apenas os arquivos necessários para execução
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/dist ./dist

# Instalar apenas dependências de produção
RUN npm install -g pnpm
RUN pnpm install --prod

# Expor porta
EXPOSE 3000

# Comando para executar a aplicação
CMD ["node", "dist/main"]
