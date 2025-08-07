import { TradeRepository } from '../../../application/repository/ITradeRepository';
import { Trade } from '../../../domain/entity/trade';
import { TradeOffer } from '../../../domain/entity/trade_offer';
import { DatabaseConnection } from '../databaseConnection/database';

export class TradeRepositoryDatabase implements TradeRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(trade: Trade): Promise<void> {
    try {
      await this.connection.none(
        'INSERT INTO trades (trade_id, proposer_id, receiver_id, target_post_id, status, message, expires_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          trade.trade_id,
          trade.proposer_id,
          trade.receiver_id,
          trade.target_post_id,
          trade.status,
          trade.message,
          trade.expires_at,
          trade.created_at,
          trade.updated_at
        ]
      );
      for (const offer of trade.offers) {
        await this.connection.none(
          'INSERT INTO trade_offers (offer_id, trade_id, post_id, cash_amount) VALUES ($1, $2, $3, $4)',
          [
            offer.offer_id,
            offer.trade_id,
            offer.post_id,
            offer.cash_amount
          ]
        );
      }
    } catch (error) {
      console.error("Error saving trade:", error);
      throw error;
    }
  }

  async getById(tradeId: string): Promise<Trade | null> {
    try {
      const tradeData = await this.connection.oneOrNone('SELECT trade_id, proposer_id, receiver_id, target_post_id, status, message, expires_at, created_at, updated_at FROM trades WHERE trade_id = $1', [tradeId]);
      if (!tradeData) return null;

      const offersData = await this.connection.manyOrNone('SELECT offer_id, trade_id, post_id, cash_amount FROM trade_offers WHERE trade_id = $1', [tradeId]);
      const offers = offersData.map(o => TradeOffer.restore(o.offer_id, o.trade_id, o.post_id, o.cash_amount));

      return Trade.restore(tradeData.trade_id, tradeData.proposer_id, tradeData.receiver_id, tradeData.target_post_id, tradeData.status, offers, tradeData.message, new Date(tradeData.expires_at), new Date(tradeData.created_at), new Date(tradeData.updated_at));
    } catch (error) {
      console.error("Error getting trade by ID:", error);
      throw error;
    }
  }

  async getTradesByUserId(userId: string): Promise<Trade[]> {
    try {
      const tradesData = await this.connection.manyOrNone('SELECT trade_id, proposer_id, receiver_id, target_post_id, status, message, expires_at, created_at, updated_at FROM trades WHERE proposer_id = $1 OR receiver_id = $1', [userId]);
      const trades: Trade[] = [];
      for (const tradeData of tradesData) {
        const offersData = await this.connection.manyOrNone('SELECT offer_id, trade_id, post_id, cash_amount FROM trade_offers WHERE trade_id = $1', [tradeData.trade_id]);
        const offers = offersData.map(o => TradeOffer.restore(o.offer_id, o.trade_id, o.post_id, o.cash_amount));
        trades.push(Trade.restore(tradeData.trade_id, tradeData.proposer_id, tradeData.receiver_id, tradeData.target_post_id, tradeData.status, offers, tradeData.message, new Date(tradeData.expires_at), new Date(tradeData.created_at), new Date(tradeData.updated_at)));
      }
      return trades;
    } catch (error) {
      console.error("Error getting trades by user ID:", error);
      throw error;
    }
  }

  async update(trade: Trade): Promise<void> {
    try {
      await this.connection.none(
        'UPDATE trades SET status = $1, updated_at = $2 WHERE trade_id = $3',
        [trade.status, trade.updated_at, trade.trade_id]
      );
    } catch (error) {
      console.error("Error updating trade:", error);
      throw error;
    }
  }
}

