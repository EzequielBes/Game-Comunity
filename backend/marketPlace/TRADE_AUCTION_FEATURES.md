# Sistema de Troca e Leilões - Marketplace

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Troca (Trade System)

#### **Funcionalidades Principais**
- **Criar Proposta de Troca**: Múltiplos itens + dinheiro
- **Aceitar/Rejeitar Propostas**: Controle total pelo receptor
- **Cancelar Propostas**: Tanto propositor quanto receptor
- **Expiração Automática**: Propostas expiram em 72h (configurável)
- **Mensagens Personalizadas**: Comunicação entre usuários
- **Validações Robustas**: Verificações de propriedade e status

#### **Endpoints de Trade**
```http
POST /marketplace/createTrade          # Criar proposta
GET /marketplace/getUserTrades         # Listar trades do usuário
PUT /marketplace/updateTradeStatus     # Aceitar/rejeitar
DELETE /marketplace/cancelTrade        # Cancelar proposta
GET /marketplace/getTrade/:trade_id    # Buscar trade específico
```

#### **Estrutura de Proposta de Troca**
```json
{
  "proposer_id": "user123",
  "receiver_id": "user456",
  "target_post_id": "post123",
  "offers": [
    {
      "post_id": "post456",
      "cash_amount": null
    },
    {
      "post_id": null,
      "cash_amount": 500.00
    }
  ],
  "message": "Interessado em trocar meu item + R$ 500,00",
  "expiresInHours": 72
}
```

### ✅ Sistema de Leilões (Auction System)

#### **Funcionalidades Principais**
- **Criar Leilões**: Preço inicial, reserva e duração
- **Fazer Lances**: Sistema de incrementos automáticos
- **Tempo Restante**: Contagem regressiva em tempo real
- **Preço de Reserva**: Garantia de valor mínimo
- **Finalização Automática**: Leilões expiram automaticamente
- **Histórico de Lances**: Rastreamento completo

#### **Endpoints de Leilão**
```http
POST /marketplace/createAuction        # Criar leilão
POST /marketplace/placeBid            # Fazer lance
GET /marketplace/getAuctions          # Listar leilões
GET /marketplace/getActiveAuctions    # Leilões ativos
PUT /marketplace/endAuction           # Finalizar leilão
GET /marketplace/getAuction/:id       # Buscar leilão
```

#### **Estrutura de Leilão**
```json
{
  "post_id": "post789",
  "seller_id": "user123",
  "starting_bid": 1000.00,
  "reserve_price": 1500.00,
  "duration_hours": 24
}
```

## 🏗️ Arquitetura Melhorada

### **Entidades Expandidas**

#### **Trade (Melhorada)**
- ✅ Expiração automática
- ✅ Mensagens personalizadas
- ✅ Validações de propriedade
- ✅ Status expandidos (pending, accepted, rejected, cancelled, expired)
- ✅ Múltiplas ofertas (itens + dinheiro)

#### **Auction (Nova)**
- ✅ Sistema de lances com incrementos
- ✅ Preço de reserva
- ✅ Contagem regressiva
- ✅ Finalização automática
- ✅ Histórico de lances

#### **Bid (Nova)**
- ✅ Registro de todos os lances
- ✅ Rastreamento de lances por usuário
- ✅ Ordenação por valor e tempo

### **Use Cases Especializados**

#### **Trade System**
- `CreateTradeProposal`: Criar proposta com validações
- `GetUserTrades`: Buscar trades do usuário
- `UpdateTradeStatus`: Gerenciar status (aceitar/rejeitar/cancelar)

#### **Auction System**
- `CreateAuction`: Criar leilão com configurações
- `PlaceBid`: Fazer lance com validações
- `GetAuctions`: Buscar leilões com filtros
- `EndAuction`: Finalizar leilão manualmente

## 📊 Banco de Dados Expandido

### **Tabelas Novas/Atualizadas**

#### **Trades (Atualizada)**
```sql
CREATE TABLE trades (
    trade_id VARCHAR(255) PRIMARY KEY,
    proposer_id VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(255) NOT NULL,
    target_post_id VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    message TEXT DEFAULT '',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Auctions (Nova)**
```sql
CREATE TABLE auctions (
    auction_id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL,
    seller_id VARCHAR(255) NOT NULL,
    starting_bid DECIMAL(10,2) NOT NULL,
    reserve_price DECIMAL(10,2) NOT NULL,
    current_bid DECIMAL(10,2) NOT NULL,
    current_bidder_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Bids (Nova)**
```sql
CREATE TABLE bids (
    bid_id VARCHAR(255) PRIMARY KEY,
    auction_id VARCHAR(255) NOT NULL,
    bidder_id VARCHAR(255) NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎮 Funcionalidades Avançadas

### **Sistema de Troca**

#### **Validações Inteligentes**
- ✅ Pelo menos uma oferta válida (item ou dinheiro)
- ✅ Apenas proprietário pode aceitar/rejeitar
- ✅ Propostas expiradas não podem ser aceitas
- ✅ Verificação de propriedade dos itens

#### **Flexibilidade de Ofertas**
- ✅ Múltiplos itens + dinheiro
- ✅ Apenas dinheiro
- ✅ Apenas itens
- ✅ Mensagens personalizadas
- ✅ Expiração configurável

### **Sistema de Leilões**

#### **Incrementos Automáticos**
- ✅ < R$ 100: incremento de R$ 10
- ✅ < R$ 1.000: incremento de R$ 50
- ✅ < R$ 10.000: incremento de R$ 100
- ✅ > R$ 10.000: 5% do lance atual

#### **Tempo Restante**
- ✅ Formatação inteligente (dias, horas, minutos)
- ✅ Expiração automática
- ✅ Status atualizado automaticamente

#### **Preço de Reserva**
- ✅ Garantia de valor mínimo
- ✅ Leilão só vende se atingir reserva
- ✅ Status diferenciado (sold vs ended)

## 🚀 Como Testar

### **1. Sistema de Troca**
```bash
# Criar proposta
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
    "message": "Interessado em trocar meu item + R$ 500,00",
    "expiresInHours": 72
  }'

# Listar trades do usuário
curl http://localhost:3004/marketplace/getUserTrades?userId=user123

# Aceitar proposta
curl -X PUT http://localhost:3004/marketplace/updateTradeStatus \
  -H "Content-Type: application/json" \
  -d '{
    "tradeId": "trade_id_aqui",
    "userId": "user456",
    "status": "accepted"
  }'
```

### **2. Sistema de Leilões**
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

# Fazer lance
curl -X POST http://localhost:3004/marketplace/placeBid \
  -H "Content-Type: application/json" \
  -d '{
    "auction_id": "auction_id_aqui",
    "bidder_id": "user456",
    "bid_amount": 1200.00
  }'

# Listar leilões ativos
curl http://localhost:3004/marketplace/getActiveAuctions
```

## 📈 Próximas Melhorias

### **Funcionalidades Adicionais**
1. **Notificações em Tempo Real**: WebSocket para atualizações
2. **Sistema de Reputação**: Avaliações de trades/leilões
3. **Chat Integrado**: Comunicação direta entre usuários
4. **Histórico Detalhado**: Logs de todas as ações
5. **Sistema de Favoritos**: Salvar trades/leilões interessantes
6. **Relatórios**: Analytics de trades e leilões

### **Melhorias Técnicas**
1. **Cache Redis**: Performance para leilões ativos
2. **Jobs em Background**: Finalização automática de leilões
3. **Validações Avançadas**: Verificação de propriedade de itens
4. **Sistema de Pagamentos**: Integração com gateway
5. **Auditoria**: Logs de segurança e compliance

## 🎯 Conclusão

O sistema de troca e leilões foi implementado com:

- ✅ **Arquitetura Robusta**: Seguindo padrões do projeto
- ✅ **Validações Completas**: Segurança e integridade
- ✅ **Flexibilidade**: Múltiplas formas de troca
- ✅ **Experiência do Usuário**: Interface intuitiva
- ✅ **Performance**: Índices otimizados
- ✅ **Escalabilidade**: Preparado para crescimento

O marketplace agora oferece uma experiência completa de negociação, permitindo tanto compras diretas quanto sistemas avançados de troca e leilões.
