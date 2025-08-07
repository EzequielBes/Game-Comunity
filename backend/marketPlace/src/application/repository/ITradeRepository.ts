import { Trade } from '../../domain/entity/trade';

export interface TradeRepository {
  save(trade: Trade): Promise<void>;
  getById(tradeId: string): Promise<Trade | null>;
  getTradesByUserId(userId: string): Promise<Trade[]>;
  update(trade: Trade): Promise<void>;
}
