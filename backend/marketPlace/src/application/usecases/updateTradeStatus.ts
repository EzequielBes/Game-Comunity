import { TradeRepository } from '../repository/ITradeRepository';

export class UpdateTradeStatus {
  constructor(readonly tradeRepository: TradeRepository) {}

  async execute(input: UpdateTradeStatusInput): Promise<void> {
    const trade = await this.tradeRepository.getById(input.tradeId);
    if (!trade) throw new Error('Trade not found');

    switch (input.status) {
      case 'accepted':
        trade.accept();
        break;
      case 'rejected':
        trade.reject();
        break;
      case 'cancelled':
        trade.cancel(input.userId);
        break;
      default:
        throw new Error('Invalid status update');
    }

    await this.tradeRepository.update(trade);
  }
}

export interface UpdateTradeStatusInput {
  tradeId: string;
  userId: string; // ID of the user performing the action
  status: 'accepted' | 'rejected' | 'cancelled';
}
