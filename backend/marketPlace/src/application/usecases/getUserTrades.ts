import { Trade } from '../../domain/entity/trade';
import { TradeRepository } from '../repository/ITradeRepository';

export class GetUserTrades {
  constructor(readonly tradeRepository: TradeRepository) {}

  async execute(userId: string): Promise<Trade[]> {
    return this.tradeRepository.getTradesByUserId(userId);
  }
}
