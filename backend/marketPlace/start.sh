#!/bin/bash

echo "🚀 Iniciando Marketplace Service..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se o PostgreSQL está rodando
echo "🔍 Verificando conexão com PostgreSQL..."
if ! pg_isready -h localhost -p 5432 -U postgres; then
    echo "❌ PostgreSQL não está rodando. Por favor, inicie o PostgreSQL primeiro."
    exit 1
fi

# Executar script SQL para criar tabelas
echo "🗄️ Criando tabelas no banco de dados..."
psql -U postgres -d users -f setup.sql

# Iniciar o servidor
echo "🌐 Iniciando servidor na porta 3004..."
npm run dev
