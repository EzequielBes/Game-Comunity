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

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado. Por favor, instale o Docker primeiro."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
        exit 1
    fi
}

# Iniciar banco de dados
start_database() {
    print_header "Iniciando Banco de Dados"

    check_docker

    print_message "Iniciando PostgreSQL e Redis..."
    docker-compose up -d postgres redis

    print_message "Aguardando PostgreSQL inicializar..."
    sleep 10

    # Verificar se o PostgreSQL está rodando
    if docker-compose ps postgres | grep -q "Up"; then
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

# Parar banco de dados
stop_database() {
    print_header "Parando Banco de Dados"

    print_message "Parando containers..."
    docker-compose down

    print_message "Banco de dados parado com sucesso!"
}

# Reiniciar banco de dados
restart_database() {
    print_header "Reiniciando Banco de Dados"

    stop_database
    start_database
}

# Limpar dados do banco
clean_database() {
    print_header "Limpando Banco de Dados"

    print_warning "Isso irá remover todos os dados do banco. Tem certeza? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_message "Removendo volumes..."
        docker-compose down -v
        docker volume rm game-comunity_postgres_data 2>/dev/null || true
        print_message "Banco de dados limpo com sucesso!"
    else
        print_message "Operação cancelada."
    fi
}

# Verificar status do banco
status_database() {
    print_header "Status do Banco de Dados"

    if docker-compose ps | grep -q "Up"; then
        print_message "Containers ativos:"
        docker-compose ps
    else
        print_message "Nenhum container ativo."
    fi
}

# Conectar ao banco
connect_database() {
    print_header "Conectando ao Banco de Dados"

    if docker-compose ps postgres | grep -q "Up"; then
        print_message "Conectando ao PostgreSQL..."
        docker-compose exec postgres psql -U postgres -d users
    else
        print_error "PostgreSQL não está rodando. Execute 'start' primeiro."
        exit 1
    fi
}

# Executar script SQL
run_sql() {
    print_header "Executando Script SQL"

    if [ -z "$1" ]; then
        print_error "Por favor, especifique o arquivo SQL."
        print_message "Uso: $0 run-sql <arquivo.sql>"
        exit 1
    fi

    if docker-compose ps postgres | grep -q "Up"; then
        print_message "Executando $1..."
        docker-compose exec -T postgres psql -U postgres -d users < "$1"
        print_message "Script executado com sucesso!"
    else
        print_error "PostgreSQL não está rodando. Execute 'start' primeiro."
        exit 1
    fi
}

# Backup do banco
backup_database() {
    print_header "Fazendo Backup do Banco de Dados"

    if docker-compose ps postgres | grep -q "Up"; then
        timestamp=$(date +"%Y%m%d_%H%M%S")
        backup_file="backup_${timestamp}.sql"

        print_message "Criando backup: $backup_file"
        docker-compose exec -T postgres pg_dump -U postgres users > "$backup_file"
        print_message "Backup criado com sucesso: $backup_file"
    else
        print_error "PostgreSQL não está rodando. Execute 'start' primeiro."
        exit 1
    fi
}

# Restaurar backup
restore_database() {
    print_header "Restaurando Backup do Banco de Dados"

    if [ -z "$1" ]; then
        print_error "Por favor, especifique o arquivo de backup."
        print_message "Uso: $0 restore <arquivo_backup.sql>"
        exit 1
    fi

    if docker-compose ps postgres | grep -q "Up"; then
        print_message "Restaurando backup: $1"
        docker-compose exec -T postgres psql -U postgres -d users < "$1"
        print_message "Backup restaurado com sucesso!"
    else
        print_error "PostgreSQL não está rodando. Execute 'start' primeiro."
        exit 1
    fi
}

# Mostrar logs
show_logs() {
    print_header "Logs do Banco de Dados"

    docker-compose logs postgres
}

# Mostrar ajuda
show_help() {
    print_header "Gerenciador de Banco de Dados"

    echo "Uso: $0 <comando>"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start       - Iniciar banco de dados"
    echo "  stop        - Parar banco de dados"
    echo "  restart     - Reiniciar banco de dados"
    echo "  status      - Verificar status"
    echo "  connect     - Conectar ao banco"
    echo "  run-sql     - Executar script SQL"
    echo "  backup      - Fazer backup do banco"
    echo "  restore     - Restaurar backup"
    echo "  clean       - Limpar todos os dados"
    echo "  logs        - Mostrar logs"
    echo "  help        - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 start"
    echo "  $0 run-sql setup.sql"
    echo "  $0 backup"
    echo "  $0 restore backup_20240101_120000.sql"
}

# Verificar argumentos
case "${1:-help}" in
    start)
        start_database
        ;;
    stop)
        stop_database
        ;;
    restart)
        restart_database
        ;;
    status)
        status_database
        ;;
    connect)
        connect_database
        ;;
    run-sql)
        run_sql "$2"
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
    logs)
        show_logs
        ;;
    help|*)
        show_help
        ;;
esac
