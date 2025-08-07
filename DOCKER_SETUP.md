# 🐳 Configuração do Banco de Dados com Docker

## 📋 Pré-requisitos

### 1. Instalar Docker
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Fedora
sudo dnf install docker docker-compose

# macOS (com Homebrew)
brew install docker docker-compose

# Windows
# Baixar Docker Desktop: https://www.docker.com/products/docker-desktop
```

### 2. Iniciar o Docker
```bash
# Linux
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar usuário ao grupo docker (opcional)
sudo usermod -aG docker $USER
```

## 🚀 Início Rápido

### 1. Iniciar o Banco de Dados
```bash
# Usar o script automatizado
./scripts/database.sh start

# Ou usar docker-compose diretamente
docker-compose up -d
```

### 2. Verificar Status
```bash
./scripts/database.sh status
```

### 3. Conectar ao Banco
```bash
./scripts/database.sh connect
```

## 📊 Configuração do Banco

### **PostgreSQL**
- **Host**: localhost
- **Porta**: 5432
- **Database**: users
- **Usuário**: postgres
- **Senha**: postgres

### **Redis**
- **Host**: localhost
- **Porta**: 6379

## 🛠️ Comandos Disponíveis

### **Gerenciamento Básico**
```bash
# Iniciar banco
./scripts/database.sh start

# Parar banco
./scripts/database.sh stop

# Reiniciar banco
./scripts/database.sh restart

# Verificar status
./scripts/database.sh status
```

### **Conectividade**
```bash
# Conectar ao PostgreSQL
./scripts/database.sh connect

# Executar script SQL
./scripts/database.sh run-sql arquivo.sql
```

### **Backup e Restauração**
```bash
# Fazer backup
./scripts/database.sh backup

# Restaurar backup
./scripts/database.sh restore backup_20240101_120000.sql
```

### **Manutenção**
```bash
# Limpar todos os dados
./scripts/database.sh clean

# Ver logs
./scripts/database.sh logs

# Mostrar ajuda
./scripts/database.sh help
```

## 🔧 Configuração Manual

### **1. Usando Docker Compose**
```bash
# Iniciar todos os serviços
docker-compose up -d

# Iniciar apenas PostgreSQL
docker-compose up -d postgres

# Iniciar apenas Redis
docker-compose up -d redis
```

### **2. Usando Docker Diretamente**
```bash
# PostgreSQL
docker run -d \
  --name game_community_postgres \
  -e POSTGRES_DB=users \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15

# Redis
docker run -d \
  --name game_community_redis \
  -p 6379:6379 \
  redis:7-alpine
```

## 📝 Scripts SQL Automáticos

O Docker Compose executa automaticamente os seguintes scripts na inicialização:

1. **`backend/marketPlace/setup.sql`** - Tabelas do marketplace
2. **`backend/user/setup.sql`** - Tabelas do usuário

### **Estrutura das Tabelas**

#### **Marketplace**
- `marketplace_posts` - Posts/anúncios
- `trades` - Propostas de troca
- `trade_offers` - Ofertas de troca
- `auctions` - Leilões
- `bids` - Lances

#### **Usuário**
- `users` - Usuários do sistema
- `user_marketplace_preferences` - Preferências

## 🔍 Troubleshooting

### **Problema: Porta já em uso**
```bash
# Verificar processos usando a porta
sudo lsof -i :5432

# Parar processo conflitante
sudo kill -9 <PID>
```

### **Problema: Container não inicia**
```bash
# Verificar logs
docker-compose logs postgres

# Verificar status
docker-compose ps

# Reiniciar containers
docker-compose restart
```

### **Problema: Permissões**
```bash
# Dar permissão ao script
chmod +x scripts/database.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
# Reiniciar sessão
```

### **Problema: Volume não encontrado**
```bash
# Recriar volumes
docker-compose down -v
docker-compose up -d
```

## 🧪 Testando a Conexão

### **1. Via Script**
```bash
./scripts/database.sh connect
```

### **2. Via Docker**
```bash
docker-compose exec postgres psql -U postgres -d users
```

### **3. Via psql (se instalado)**
```bash
psql -h localhost -p 5432 -U postgres -d users
```

### **4. Teste de Conexão**
```sql
-- Conectar ao banco
\c users

-- Listar tabelas
\dt

-- Testar query
SELECT version();
```

## 📊 Monitoramento

### **Verificar Uso de Recursos**
```bash
# Ver uso de CPU e memória
docker stats

# Ver logs em tempo real
docker-compose logs -f postgres
```

### **Backup Automático**
```bash
# Criar backup com timestamp
./scripts/database.sh backup

# Listar backups
ls -la backup_*.sql
```

## 🔒 Segurança

### **Alterar Senhas**
```bash
# Editar docker-compose.yml
POSTGRES_PASSWORD=sua_nova_senha

# Reiniciar containers
docker-compose down
docker-compose up -d
```

### **Firewall**
```bash
# Permitir apenas conexões locais
# O Docker já configura isso automaticamente
```

## 🚀 Próximos Passos

1. **Iniciar o banco**: `./scripts/database.sh start`
2. **Verificar status**: `./scripts/database.sh status`
3. **Conectar ao banco**: `./scripts/database.sh connect`
4. **Iniciar os serviços**: Ver README.md principal

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs: `./scripts/database.sh logs`
2. Verificar status: `./scripts/database.sh status`
3. Reiniciar: `./scripts/database.sh restart`
4. Limpar e recriar: `./scripts/database.sh clean && ./scripts/database.sh start`
