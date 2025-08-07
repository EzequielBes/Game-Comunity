import { v4 as uuidv4 } from 'uuid';

export class TradeOffer {
  private constructor(
    readonly offer_id: string,
    readonly trade_id: string,
    readonly post_id: string | undefined,
    readonly cash_amount: number | undefined
  ) {
    if (!post_id && !cash_amount) {
      throw new Error('An offer must contain either a post or a cash amount.');
    }
  }

  static create(trade_id: string, post_id?: string, cash_amount?: number) {
    const offer_id = uuidv4();
    return new TradeOffer(offer_id, trade_id, post_id, cash_amount);
  }

  static restore(offer_id: string, trade_id: string, post_id?: string, cash_amount?: number) {
    return new TradeOffer(offer_id, trade_id, post_id, cash_amount);
  }
}
