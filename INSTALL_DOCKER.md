# 🐳 Instalação do Docker

## 📋 Instalação no Fedora

### **1. Atualizar Sistema**
```bash
sudo dnf update
```

### **2. Instalar Docker**
```bash
# Instalar Docker
sudo dnf install docker docker-compose

# Ou instalar via repositório oficial
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### **3. Iniciar e Habilitar Docker**
```bash
# Iniciar serviço
sudo systemctl start docker

# Habilitar para iniciar automaticamente
sudo systemctl enable docker

# Verificar status
sudo systemctl status docker
```

### **4. Adicionar Usuário ao Grupo Docker**
```bash
# Adicionar usuário ao grupo
sudo usermod -aG docker $USER

# Aplicar mudanças (ou fazer logout/login)
newgrp docker
```

### **5. Testar Instalação**
```bash
# Verificar versão
docker --version
docker-compose --version

# Testar com container simples
docker run hello-world
```

## 🔧 Alternativa: PostgreSQL Local

Se não conseguir instalar o Docker, você pode usar PostgreSQL local:

### **1. Instalar PostgreSQL**
```bash
# Fedora
sudo dnf install postgresql postgresql-server postgresql-contrib

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
```

### **2. Inicializar Banco**
```bash
# Inicializar cluster
sudo postgresql-setup --initdb

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **3. Configurar Usuário**
```bash
# Conectar como postgres
sudo -u postgres psql

# Criar usuário e banco
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE users OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE users TO postgres;
\q
```

### **4. Executar Scripts SQL**
```bash
# Executar script do marketplace
psql -U postgres -d users -f backend/marketPlace/setup.sql

# Executar script do usuário
psql -U postgres -d users -f backend/user/setup.sql
```

## 🚀 Verificação da Instalação

### **Teste Docker**
```bash
# Verificar se Docker está rodando
docker ps

# Testar PostgreSQL no Docker
docker run --rm -e POSTGRES_PASSWORD=test postgres:15 psql -h localhost -U postgres -c "SELECT version();"
```

### **Teste PostgreSQL Local**
```bash
# Conectar ao banco
psql -U postgres -d users

# Listar tabelas
\dt

# Sair
\q
```

## 🔍 Troubleshooting

### **Problema: Permissões Docker**
```bash
# Verificar se usuário está no grupo docker
groups $USER

# Se não estiver, adicionar novamente
sudo usermod -aG docker $USER
newgrp docker
```

### **Problema: Porta PostgreSQL em Uso**
```bash
# Verificar processo usando porta 5432
sudo lsof -i :5432

# Parar PostgreSQL local se necessário
sudo systemctl stop postgresql
```

### **Problema: Firewall**
```bash
# Permitir Docker no firewall
sudo firewall-cmd --permanent --add-masquerade
sudo firewall-cmd --reload
```

## 📊 Configuração Final

### **Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:

```bash
# Para Docker
DB_HOST=localhost
DB_PORT=5432
DB_NAME=users
DB_USER=postgres
DB_PASSWORD=postgres

# Para PostgreSQL local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=users
DB_USER=postgres
DB_PASSWORD=postgres
```

### **Teste de Conexão**
```bash
# Testar conexão
psql -h localhost -p 5432 -U postgres -d users -c "SELECT version();"
```

## 🎯 Próximos Passos

1. **Instalar Docker**: Seguir guia acima
2. **Iniciar banco**: `./scripts/database.sh start`
3. **Verificar status**: `./scripts/database.sh status`
4. **Iniciar serviços**: Ver README.md principal

## 📞 Suporte

Se encontrar problemas:

1. **Docker não instala**: Usar PostgreSQL local
2. **Permissões**: Verificar grupo docker
3. **Porta ocupada**: Parar PostgreSQL local
4. **Firewall**: Configurar regras necessárias
