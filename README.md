# Rural Producer API

API desenvolvida para gerenciamento de produtores rurais, suas propriedades e culturas, seguindo os princípios da Clean Architecture e boas práticas de desenvolvimento.

## 🚀 Tecnologias Utilizadas

### Core

- **Node.js** - Ambiente de execução
- **NestJS** - Framework para construção de aplicações escaláveis
- **TypeScript** - Superset JavaScript com tipagem estática
- **Prisma** - ORM para interação com banco de dados
- **PostgreSQL** - Banco de dados relacional

### Monitoramento e Logs

- **Prometheus** - Coleta de métricas
- **Grafana** - Visualização de métricas e logs
- **Loki** - Agregação de logs
- **Promtail** - Coleta de logs

### Infraestrutura

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

### Documentação e Testes

- **Swagger/OpenAPI** - Documentação da API
- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture, dividindo-se em camadas bem definidas:

### Camadas

1. **Core/Domain**

   - Entidades de negócio
   - Regras de negócio
   - Interfaces de repositório
   - Use Cases

2. **Infrastructure**

   - Implementações de repositórios
   - Adaptadores de banco de dados
   - Controllers HTTP

3. **Application**

   - Configurações da aplicação
   - Módulos NestJS
   - Providers

4. **Shared**
   - Utilitários
   - Validadores
   - Tratamento de erros
   - Logging

### Estrutura de Pastas

```
src/
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── value-objects/
│   └── use-cases/
├── infra/
│   ├── database/
│   │   ├── prisma/
│   │   └── repositories/
│   └── http/
│       ├── controllers/
│       └── dtos/
├── modules/
└── shared/
    ├── logger/
    ├── validators/
    └── errors/
```

## 🔧 Configuração e Instalação

### Pré-requisitos

- Docker e Docker Compose
- Node.js (v18+)
- NPM ou Yarn

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie os containers
docker compose -f docker/docker-compose.yml up -d
```

### Portas

- API: http://localhost:3002
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

## 📈 Monitoramento e Observabilidade

### Métricas (Prometheus/Grafana)

- Requisições HTTP (contagem, duração)
- Uso de recursos (CPU, memória)
- Métricas de negócio

### Logs (Loki/Grafana)

- Logs estruturados
- Níveis de log (ERROR, WARN, INFO, DEBUG)
- Rastreamento de requisições

## 🧪 Testes

### Tipos de Teste

1. **Unitários**

   - Use Cases
   - Validadores
   - Entidades

2. **Integração**

   - Controllers
   - Repositórios

3. **E2E**
   - Fluxos completos
   - API endpoints

### Executando Testes

```bash
# Unitários
npm run test

# Integração
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📝 Documentação API

A documentação da API está disponível em Swagger:

- URL: http://localhost:3002/api-docs

### Principais Endpoints

- `POST /producers` - Criar produtor
- `GET /producers/:id` - Buscar produtor
- `POST /farms` - Criar fazenda
- `GET /dashboard` - Métricas e estatísticas

## 🤝 Decisões Arquiteturais

1. **Clean Architecture**

   - Separação clara de responsabilidades
   - Inversão de dependência
   - Facilidade de manutenção e teste

2. **Domain-Driven Design (DDD)**

   - Entidades ricas
   - Value Objects
   - Agregados bem definidos

3. **SOLID**

   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

4. **Observabilidade**

   - Logs estruturados
   - Métricas em tempo real
   - Rastreamento de requisições

5. **Containerização**
   - Ambiente isolado
   - Facilidade de deploy
   - Consistência entre ambientes

## 🔒 Segurança

- Validação de CPF/CNPJ
- Tratamento de erros centralizado
- Logs seguros
- Rate limiting

## ⚖️ Licença

MIT
