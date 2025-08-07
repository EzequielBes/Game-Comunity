import { Trade } from '../../domain/entity/trade';
import { TradeOffer } from '../../domain/entity/trade_offer';
import { TradeRepository as ITradeRepository } from './ITradeRepository';

export class TradeRepository implements ITradeRepository {
  async save(trade: Trade): Promise<void> {
    // Implementation
  }

  async getById(tradeId: string): Promise<Trade | null> {
    // Implementation
    return null;
  }

  async getTradesByUserId(userId: string): Promise<Trade[]> {
    // Implementation
    return [];
  }

  async update(trade: Trade): Promise<void> {
    // Implementation
  }
}
