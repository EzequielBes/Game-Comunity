import { Trade } from '../../domain/entity/trade';
import { TradeRepository } from '../repository/ITradeRepository';

export class CreateTradeProposal {
  constructor(readonly tradeRepository: TradeRepository) {}

  async execute(input: CreateTradeProposalInput): Promise<string> {
    // Validate that offers are not empty
    if (!input.offers || input.offers.length === 0) {
      throw new Error('Trade proposal must include at least one offer');
    }

    // Validate that at least one offer has a post_id or cash_amount
    const hasValidOffer = input.offers.some(offer => offer.post_id || offer.cash_amount);
    if (!hasValidOffer) {
      throw new Error('Trade proposal must include at least one valid offer (item or cash)');
    }

    const trade = Trade.create(
      input.proposer_id, 
      input.receiver_id, 
      input.target_post_id, 
      input.offers,
      input.message,
      input.expiresInHours
    );

    await this.tradeRepository.save(trade);
    return "Trade proposal created successfully";
  }
}

export interface CreateTradeProposalInput {
  proposer_id: string;
  receiver_id: string;
  target_post_id: string;
  offers: { post_id?: string; cash_amount?: number }[];
  message?: string;
  expiresInHours?: number;
}
