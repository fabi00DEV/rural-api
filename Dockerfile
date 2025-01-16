# Use a imagem base oficial do Node.js
FROM node:20-alpine AS base

# Configure o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie apenas os arquivos de dependências para instalar primeiro
COPY package*.json ./
# COPY prisma ./prisma/
COPY src/infra/database/prisma/schema.prisma ./prisma/

# Instale todas as dependências (incluindo as de desenvolvimento)
RUN npm ci

# Gere o cliente Prisma
RUN npx prisma generate

# Copie o restante dos arquivos do projeto
COPY . .

# Compile o projeto NestJS
RUN npx nest build

# Etapa final: criar a imagem para produção
FROM node:18-alpine AS production

# Configure o diretório de trabalho
WORKDIR /app

# Copie as dependências instaladas da etapa anterior
COPY --from=base /app/node_modules ./node_modules

# Copie a pasta `dist` (após a build)
COPY --from=base /app/dist ./dist

# Copie a pasta `prisma` para migrações e geração de cliente
COPY --from=base /app/prisma ./prisma

# Variável de ambiente para o Prisma
ENV NODE_ENV=production

# Exponha a porta da aplicação
EXPOSE 3000

# Comando para rodar migrações e iniciar o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
