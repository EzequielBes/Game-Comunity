# 🚀 Configuração Rápida do Banco de Dados

## 📋 Opções Disponíveis

### **Opção 1: Docker (Recomendado)**
```bash
# 1. Instalar Docker
sudo dnf install docker docker-compose

# 2. Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# 3. Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# 4. Iniciar banco de dados
./scripts/database.sh start
```

### **Opção 2: PostgreSQL Local**
```bash
# 1. Instalar PostgreSQL
sudo dnf install postgresql postgresql-server postgresql-contrib

# 2. Inicializar banco
sudo postgresql-setup --initdb

# 3. Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 4. Configurar banco
./scripts/local_database.sh init
./scripts/local_database.sh run-scripts
```

## 🎯 Passo a Passo Rápido

### **1. Escolher Opção**
Decida se quer usar Docker ou PostgreSQL local.

### **2. Instalar Dependências**
```bash
# Para Docker
sudo dnf install docker docker-compose

# Para PostgreSQL local
sudo dnf install postgresql postgresql-server postgresql-contrib
```

### **3. Configurar Banco**
```bash
# Para Docker
./scripts/database.sh start

# Para PostgreSQL local
./scripts/local_database.sh init
./scripts/local_database.sh run-scripts
```

### **4. Testar Conexão**
```bash
# Para Docker
./scripts/database.sh connect

# Para PostgreSQL local
./scripts/local_database.sh test
```

## 🔧 Configuração do Projeto

### **1. Variáveis de Ambiente**
Crie um arquivo `.env` na raiz:

```bash
# Configuração do banco
DB_HOST=localhost
DB_PORT=5432
DB_NAME=users
DB_USER=postgres
DB_PASSWORD=postgres

# Configuração dos serviços
USER_SERVICE_PORT=3001
FRIENDS_SERVICE_PORT=3002
CHAT_SERVICE_PORT=3003
MARKETPLACE_SERVICE_PORT=3004
FRONTEND_PORT=3000
```

### **2. Instalar Dependências dos Serviços**
```bash
# Backend services
cd backend/user && npm install
cd ../friends && npm install
cd ../chat && npm install
cd ../marketPlace && npm install

# Frontend
cd ../../front-end && npm install
```

### **3. Iniciar Serviços**
```bash
# Terminal 1 - User Service
cd backend/user && npm run dev

# Terminal 2 - Friends Service
cd backend/friends && npm run dev

# Terminal 3 - Chat Service
cd backend/chat && npm run dev

# Terminal 4 - Marketplace Service
cd backend/marketPlace && npm run dev

# Terminal 5 - Frontend
cd front-end && npm run dev
```

## 🧪 Testes Rápidos

### **1. Testar Banco de Dados**
```bash
# Conectar ao banco
psql -U postgres -d users

# Listar tabelas
\dt

# Sair
\q
```

### **2. Testar Marketplace API**
```bash
# Criar post
curl -X POST http://localhost:3004/marketplace/createPost \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "description": "Descrição teste",
    "price": 100.00,
    "category": "electronics",
    "rarity": "Common",
    "condition": "New",
    "tradeable": true,
    "seller_id": "user123"
  }'

# Listar posts
curl http://localhost:3004/marketplace/getPosts
```

### **3. Testar Sistema de Troca**
```bash
# Criar proposta de troca
curl -X POST http://localhost:3004/marketplace/createTrade \
  -H "Content-Type: application/json" \
  -d '{
    "proposer_id": "user123",
    "receiver_id": "user456",
    "target_post_id": "post123",
    "offers": [
      {"post_id": "post456", "cash_amount": null},
      {"post_id": null, "cash_amount": 500.00}
    ],
    "message": "Interessado em trocar",
    "expiresInHours": 72
  }'
```

### **4. Testar Sistema de Leilões**
```bash
# Criar leilão
curl -X POST http://localhost:3004/marketplace/createAuction \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "post789",
    "seller_id": "user123",
    "starting_bid": 1000.00,
    "reserve_price": 1500.00,
    "duration_hours": 24
  }'

# Listar leilões ativos
curl http://localhost:3004/marketplace/getActiveAuctions
```

## 🔍 Troubleshooting

### **Problema: Docker não instala**
```bash
# Usar PostgreSQL local
sudo dnf install postgresql postgresql-server postgresql-contrib
./scripts/local_database.sh init
```

### **Problema: Porta 5432 ocupada**
```bash
# Verificar processo
sudo lsof -i :5432

# Parar PostgreSQL local se necessário
sudo systemctl stop postgresql
```

### **Problema: Permissões**
```bash
# Dar permissão aos scripts
chmod +x scripts/*.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

## 📊 Verificação Final

### **1. Banco de Dados**
```bash
# Testar conexão
psql -U postgres -d users -c "SELECT version();"

# Verificar tabelas
psql -U postgres -d users -c "\dt"
```

### **2. Serviços**
```bash
# Verificar se todos os serviços estão rodando
curl http://localhost:3001/health  # User service
curl http://localhost:3002/health  # Friends service
curl http://localhost:3003/health  # Chat service
curl http://localhost:3004/health  # Marketplace service
```

### **3. Frontend**
```bash
# Acessar no navegador
http://localhost:3000
```

## 🎉 Próximos Passos

1. **Banco configurado**: ✅
2. **Serviços rodando**: ✅
3. **Frontend acessível**: ✅
4. **Testar funcionalidades**: 🚀

Agora você pode testar todas as funcionalidades do marketplace, incluindo o sistema de troca e leilões!
