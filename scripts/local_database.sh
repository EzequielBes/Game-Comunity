#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar se PostgreSQL está instalado
check_postgresql() {
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL não está instalado."
        print_message "Instale com: sudo dnf install postgresql postgresql-server postgresql-contrib"
        exit 1
    fi
}

# Verificar se PostgreSQL está rodando
check_postgresql_running() {
    if ! systemctl is-active --quiet postgresql; then
        print_warning "PostgreSQL não está rodando. Tentando iniciar..."
        sudo systemctl start postgresql
        sleep 3
    fi

    if ! systemctl is-active --quiet postgresql; then
        print_error "Falha ao iniciar PostgreSQL"
        exit 1
    fi
}

# Inicializar banco de dados
init_database() {
    print_header "Inicializando Banco de Dados Local"

    check_postgresql
    check_postgresql_running

    print_message "Configurando banco de dados..."

    # Criar usuário e banco se não existirem
    sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || true
    sudo -u postgres psql -c "CREATE DATABASE users OWNER postgres;" 2>/dev/null || true
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE users TO postgres;" 2>/dev/null || true

    print_message "Banco de dados configurado com sucesso!"
}

# Executar scripts SQL
run_sql_scripts() {
    print_header "Executando Scripts SQL"

    check_postgresql_running

    # Executar script do marketplace
    if [ -f "backend/marketPlace/setup.sql" ]; then
        print_message "Executando script do marketplace..."
        psql -U postgres -d users -f backend/marketPlace/setup.sql
    else
        print_error "Arquivo backend/marketPlace/setup.sql não encontrado"
    fi

    # Executar script do usuário
    if [ -f "backend/user/setup.sql" ]; then
        print_message "Executando script do usuário..."
        psql -U postgres -d users -f backend/user/setup.sql
    else
        print_error "Arquivo backend/user/setup.sql não encontrado"
    fi

    print_message "Scripts SQL executados com sucesso!"
}

# Iniciar PostgreSQL
start_postgresql() {
    print_header "Iniciando PostgreSQL"

    check_postgresql

    print_message "Iniciando PostgreSQL..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql

    if systemctl is-active --quiet postgresql; then
        print_message "PostgreSQL iniciado com sucesso!"
        print_message "Host: localhost"
        print_message "Porta: 5432"
        print_message "Database: users"
        print_message "Usuário: postgres"
        print_message "Senha: postgres"
    else
        print_error "Falha ao iniciar PostgreSQL"
        exit 1
    fi
}

# Parar PostgreSQL
stop_postgresql() {
    print_header "Parando PostgreSQL"

    print_message "Parando PostgreSQL..."
    sudo systemctl stop postgresql

    print_message "PostgreSQL parado com sucesso!"
}

# Verificar status
status_postgresql() {
    print_header "Status do PostgreSQL"

    if systemctl is-active --quiet postgresql; then
        print_message "PostgreSQL está rodando"
        systemctl status postgresql --no-pager -l
    else
        print_message "PostgreSQL não está rodando"
    fi
}

# Conectar ao banco
connect_database() {
    print_header "Conectando ao Banco de Dados"

    check_postgresql_running

    print_message "Conectando ao PostgreSQL..."
    psql -U postgres -d users
}

# Executar script SQL específico
run_sql() {
    print_header "Executando Script SQL"

    if [ -z "$1" ]; then
        print_error "Por favor, especifique o arquivo SQL."
        print_message "Uso: $0 run-sql <arquivo.sql>"
        exit 1
    fi

    check_postgresql_running

    if [ -f "$1" ]; then
        print_message "Executando $1..."
        psql -U postgres -d users -f "$1"
        print_message "Script executado com sucesso!"
    else
        print_error "Arquivo $1 não encontrado"
        exit 1
    fi
}

# Backup do banco
backup_database() {
    print_header "Fazendo Backup do Banco de Dados"

    check_postgresql_running

    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_file="backup_${timestamp}.sql"

    print_message "Criando backup: $backup_file"
    pg_dump -U postgres users > "$backup_file"
    print_message "Backup criado com sucesso: $backup_file"
}

# Restaurar backup
restore_database() {
    print_header "Restaurando Backup do Banco de Dados"

    if [ -z "$1" ]; then
        print_error "Por favor, especifique o arquivo de backup."
        print_message "Uso: $0 restore <arquivo_backup.sql>"
        exit 1
    fi

    check_postgresql_running

    if [ -f "$1" ]; then
        print_message "Restaurando backup: $1"
        psql -U postgres -d users < "$1"
        print_message "Backup restaurado com sucesso!"
    else
        print_error "Arquivo $1 não encontrado"
        exit 1
    fi
}

# Limpar banco
clean_database() {
    print_header "Limpando Banco de Dados"

    print_warning "Isso irá remover todos os dados do banco. Tem certeza? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_message "Removendo dados..."
        sudo -u postgres dropdb users 2>/dev/null || true
        sudo -u postgres createdb users
        print_message "Banco de dados limpo com sucesso!"
    else
        print_message "Operação cancelada."
    fi
}

# Testar conexão
test_connection() {
    print_header "Testando Conexão"

    check_postgresql_running

    print_message "Testando conexão com PostgreSQL..."
    if psql -U postgres -d users -c "SELECT version();" > /dev/null 2>&1; then
        print_message "Conexão bem-sucedida!"
        psql -U postgres -d users -c "SELECT version();"
    else
        print_error "Falha na conexão"
        exit 1
    fi
}

# Mostrar ajuda
show_help() {
    print_header "Gerenciador de Banco de Dados Local"

    echo "Uso: $0 <comando>"
    echo ""
    echo "Comandos disponíveis:"
    echo "  init        - Inicializar banco de dados"
    echo "  start       - Iniciar PostgreSQL"
    echo "  stop        - Parar PostgreSQL"
    echo "  status      - Verificar status"
    echo "  connect     - Conectar ao banco"
    echo "  run-sql     - Executar script SQL"
    echo "  run-scripts - Executar todos os scripts SQL"
    echo "  backup      - Fazer backup do banco"
    echo "  restore     - Restaurar backup"
    echo "  clean       - Limpar todos os dados"
    echo "  test        - Testar conexão"
    echo "  help        - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 init"
    echo "  $0 run-sql setup.sql"
    echo "  $0 backup"
    echo "  $0 restore backup_20240101_120000.sql"
}

# Verificar argumentos
case "${1:-help}" in
    init)
        init_database
        ;;
    start)
        start_postgresql
        ;;
    stop)
        stop_postgresql
        ;;
    status)
        status_postgresql
        ;;
    connect)
        connect_database
        ;;
    run-sql)
        run_sql "$2"
        ;;
    run-scripts)
        run_sql_scripts
        ;;
    backup)
        backup_database
        ;;
    restore)
        restore_database "$2"
        ;;
    clean)
        clean_database
        ;;
    test)
        test_connection
        ;;
    help|*)
        show_help
        ;;
esac
