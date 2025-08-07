-- Criar tabela para posts do marketplace
CREATE TABLE IF NOT EXISTS "marketplace_posts" (
    post_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    tradeable BOOLEAN DEFAULT FALSE,
    seller_id VARCHAR(255) NOT NULL,
    images JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela para trades
CREATE TABLE IF NOT EXISTS "trades" (
    trade_id VARCHAR(255) PRIMARY KEY,
    proposer_id VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(255) NOT NULL,
    target_post_id VARCHAR(255) NOT NULL REFERENCES "marketplace_posts"(post_id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'expired')),
    message TEXT DEFAULT '',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela para itens da oferta de trade
CREATE TABLE IF NOT EXISTS "trade_offers" (
    offer_id VARCHAR(255) PRIMARY KEY,
    trade_id VARCHAR(255) NOT NULL REFERENCES "trades"(trade_id) ON DELETE CASCADE,
    post_id VARCHAR(255) REFERENCES "marketplace_posts"(post_id),
    cash_amount DECIMAL(10, 2),
    CONSTRAINT post_or_cash_check CHECK (post_id IS NOT NULL OR cash_amount IS NOT NULL)
);

-- Criar tabela para leilões
CREATE TABLE IF NOT EXISTS "auctions" (
    auction_id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL REFERENCES "marketplace_posts"(post_id),
    seller_id VARCHAR(255) NOT NULL,
    starting_bid DECIMAL(10,2) NOT NULL,
    reserve_price DECIMAL(10,2) NOT NULL,
    current_bid DECIMAL(10,2) NOT NULL,
    current_bidder_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled', 'sold')),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela para lances
CREATE TABLE IF NOT EXISTS "bids" (
    bid_id VARCHAR(255) PRIMARY KEY,
    auction_id VARCHAR(255) NOT NULL REFERENCES "auctions"(auction_id) ON DELETE CASCADE,
    bidder_id VARCHAR(255) NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_marketplace_posts_status ON "marketplace_posts"(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_posts_category ON "marketplace_posts"(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_posts_seller_id ON "marketplace_posts"(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_posts_price ON "marketplace_posts"(price);
CREATE INDEX IF NOT EXISTS idx_marketplace_posts_created_at ON "marketplace_posts"(created_at);
CREATE INDEX IF NOT EXISTS idx_trades_proposer_id ON "trades"(proposer_id);
CREATE INDEX IF NOT EXISTS idx_trades_receiver_id ON "trades"(receiver_id);
CREATE INDEX IF NOT EXISTS idx_trade_offers_trade_id ON "trade_offers"(trade_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON "auctions"(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON "auctions"(end_time);
CREATE INDEX IF NOT EXISTS idx_auctions_seller_id ON "auctions"(seller_id);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON "bids"(bid_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON "bids"(bidder_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_marketplace_posts_updated_at
    BEFORE UPDATE ON "marketplace_posts"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
    BEFORE UPDATE ON "trades"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auctions_updated_at
    BEFORE UPDATE ON "auctions"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
