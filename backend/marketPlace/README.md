# Marketplace Service

Este é o serviço de marketplace da aplicação Game Community, responsável por gerenciar anúncios de produtos.

## Funcionalidades

### Posts do Marketplace
- **Criar anúncio**: POST `/marketplace/createPost`
- **Listar anúncios**: GET `/marketplace/getPosts`
- **Buscar anúncio por ID**: GET `/marketplace/getPost/:post_id`
- **Atualizar anúncio**: PUT `/marketplace/updatePost`
- **Deletar anúncio**: DELETE `/marketplace/deletePost`
- **Buscar por vendedor**: GET `/marketplace/getPostsBySeller`
- **Listar categorias**: GET `/marketplace/getCategories`

## Estrutura do Projeto

```
src/
├── application/           # Use Cases
│   ├── create_post_usecase.ts
│   ├── get_posts_usecase.ts
│   ├── update_post_usecase.ts
│   └── delete_post_usecase.ts
├── domain/               # Domain Layer
│   ├── controllers/      # Controllers
│   ├── entity/          # Entities
│   └── vo/              # Value Objects
└── infra/               # Infrastructure Layer
    ├── database/         # Database
    └── http/            # HTTP Server
```

## Tecnologias

- **TypeScript**: Linguagem principal
- **Express**: Framework web
- **PostgreSQL**: Banco de dados
- **pg-promise**: Cliente PostgreSQL
- **UUID**: Geração de IDs únicos

## Configuração

1. Instalar dependências:
```bash
npm install
```

2. Configurar banco de dados:
```bash
psql -U postgres -d users -f setup.sql
```

3. Executar em desenvolvimento:
```bash
npm run dev
```

## Endpoints

### Criar Anúncio
```http
POST /marketplace/createPost
Content-Type: application/json

{
  "title": "iPhone 13 Pro",
  "description": "iPhone 13 Pro em excelente estado, 128GB",
  "price": 4500.00,
  "category": "electronics",
  "seller_id": "user123",
  "images": ["url1", "url2"]
}
```

### Listar Anúncios
```http
GET /marketplace/getPosts?category=electronics&minPrice=100&maxPrice=5000&search=iphone&limit=10&offset=0
```

### Atualizar Anúncio
```http
PUT /marketplace/updatePost
Content-Type: application/json

{
  "post_id": "post123",
  "seller_id": "user123",
  "title": "iPhone 13 Pro - Novo Preço",
  "price": 4200.00,
  "status": "active"
}
```

### Deletar Anúncio
```http
DELETE /marketplace/deletePost
Content-Type: application/json

{
  "post_id": "post123",
  "seller_id": "user123"
}
```

## Categorias Válidas

- electronics
- clothing
- books
- sports
- home
- automotive
- toys
- health
- beauty
- other

## Arquitetura

O projeto segue a **Arquitetura Hexagonal** com:

- **Domain Layer**: Entidades, Value Objects e regras de negócio
- **Application Layer**: Use Cases e casos de uso
- **Infrastructure Layer**: Repositórios, HTTP Server e banco de dados

### Padrões Utilizados

- **SOLID**: Princípios de design
- **DDD**: Domain-Driven Design
- **Repository Pattern**: Acesso a dados
- **Value Objects**: Validação de dados
- **Use Cases**: Casos de uso da aplicação
