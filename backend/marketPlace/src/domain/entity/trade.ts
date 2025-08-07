import { v4 as uuidv4 } from 'uuid';
import { TradeOffer } from './trade_offer';

export type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired';

export class Trade {
  private constructor(
    readonly trade_id: string,
    readonly proposer_id: string,
    readonly receiver_id: string,
    readonly target_post_id: string,
    public status: TradeStatus,
    readonly offers: TradeOffer[],
    readonly message: string,
    readonly expires_at: Date,
    readonly created_at: Date,
    public updated_at: Date
  ) {}

  static create(
    proposer_id: string,
    receiver_id: string,
    target_post_id: string,
    offers: { post_id?: string; cash_amount?: number }[],
    message: string = '',
    expiresInHours: number = 72
  ) {
    const trade_id = uuidv4();
    const tradeOffers = offers.map(offer => TradeOffer.create(trade_id, offer.post_id, offer.cash_amount));
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + expiresInHours);

    return new Trade(
      trade_id,
      proposer_id,
      receiver_id,
      target_post_id,
      'pending',
      tradeOffers,
      message,
      expires_at,
      new Date(),
      new Date()
    );
  }

  static restore(
    trade_id: string,
    proposer_id: string,
    receiver_id: string,
    target_post_id: string,
    status: TradeStatus,
    offers: TradeOffer[],
    message: string,
    expires_at: Date,
    created_at: Date,
    updated_at: Date
  ) {
    return new Trade(
      trade_id,
      proposer_id,
      receiver_id,
      target_post_id,
      status,
      offers,
      message,
      expires_at,
      created_at,
      updated_at
    );
  }

  accept() {
    if (this.status !== 'pending') throw new Error('Cannot accept a trade that is not pending');
    if (this.isExpired()) throw new Error('Cannot accept an expired trade');
    this.status = 'accepted';
    this.updated_at = new Date();
  }

  reject() {
    if (this.status !== 'pending') throw new Error('Cannot reject a trade that is not pending');
    this.status = 'rejected';
    this.updated_at = new Date();
  }

  cancel(userId: string) {
    if (this.proposer_id !== userId && this.receiver_id !== userId) {
      throw new Error('Only the proposer or receiver can cancel the trade');
    }
    if (this.status !== 'pending') throw new Error('Cannot cancel a trade that is not pending');
    this.status = 'cancelled';
    this.updated_at = new Date();
  }

  isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  getTotalValue(): number {
    return this.offers.reduce((total, offer) => {
      return total + (offer.cash_amount || 0);
    }, 0);
  }

  getOfferedItems(): string[] {
    return this.offers
      .filter(offer => offer.post_id)
      .map(offer => offer.post_id!);
  }

  canBeModifiedBy(userId: string): boolean {
    return this.proposer_id === userId && this.status === 'pending';
  }

  canBeRespondedBy(userId: string): boolean {
    return this.receiver_id === userId && this.status === 'pending' && !this.isExpired();
  }

  getStatusDisplay(): string {
    if (this.isExpired() && this.status === 'pending') {
      return 'expired';
    }
    return this.status;
  }
}
