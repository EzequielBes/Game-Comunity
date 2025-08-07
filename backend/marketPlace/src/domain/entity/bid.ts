import { v4 as uuidv4 } from 'uuid';

export class Bid {
  private constructor(
    readonly bid_id: string,
    readonly auction_id: string,
    readonly bidder_id: string,
    readonly bid_amount: number,
    readonly created_at: Date
  ) {}

  static create(
    auction_id: string,
    bidder_id: string,
    bid_amount: number
  ) {
    const bid_id = uuidv4();
    return new Bid(bid_id, auction_id, bidder_id, bid_amount, new Date());
  }

  static restore(
    bid_id: string,
    auction_id: string,
    bidder_id: string,
    bid_amount: number,
    created_at: Date
  ) {
    return new Bid(bid_id, auction_id, bidder_id, bid_amount, created_at);
  }

  getBidAmount(): number {
    return this.bid_amount;
  }

  getBidderId(): string {
    return this.bidder_id;
  }

  getAuctionId(): string {
    return this.auction_id;
  }

  getCreatedAt(): Date {
    return this.created_at;
  }
}
