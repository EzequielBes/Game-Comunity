import { v4 as uuidv4 } from 'uuid';

export type AuctionStatus = 'active' | 'ended' | 'cancelled' | 'sold';

export class Auction {
  private constructor(
    readonly auction_id: string,
    readonly post_id: string,
    readonly seller_id: string,
    readonly starting_bid: number,
    readonly reserve_price: number,
    public current_bid: number,
    public current_bidder_id: string | null,
    public status: AuctionStatus,
    readonly start_time: Date,
    readonly end_time: Date,
    readonly created_at: Date,
    public updated_at: Date
  ) {}

  static create(
    post_id: string,
    seller_id: string,
    starting_bid: number,
    reserve_price: number,
    duration_hours: number = 24
  ) {
    const auction_id = uuidv4();
    const start_time = new Date();
    const end_time = new Date();
    end_time.setHours(end_time.getHours() + duration_hours);

    return new Auction(
      auction_id,
      post_id,
      seller_id,
      starting_bid,
      reserve_price,
      starting_bid,
      null,
      'active',
      start_time,
      end_time,
      new Date(),
      new Date()
    );
  }

  static restore(
    auction_id: string,
    post_id: string,
    seller_id: string,
    starting_bid: number,
    reserve_price: number,
    current_bid: number,
    current_bidder_id: string | null,
    status: AuctionStatus,
    start_time: Date,
    end_time: Date,
    created_at: Date,
    updated_at: Date
  ) {
    return new Auction(
      auction_id,
      post_id,
      seller_id,
      starting_bid,
      reserve_price,
      current_bid,
      current_bidder_id,
      status,
      start_time,
      end_time,
      created_at,
      updated_at
    );
  }

  placeBid(bidder_id: string, bid_amount: number) {
    if (this.status !== 'active') {
      throw new Error('Auction is not active');
    }

    if (this.isExpired()) {
      throw new Error('Auction has expired');
    }

    if (bidder_id === this.seller_id) {
      throw new Error('Seller cannot bid on their own auction');
    }

    if (bid_amount <= this.current_bid) {
      throw new Error('Bid must be higher than current bid');
    }

    if (bid_amount < this.starting_bid) {
      throw new Error('Bid must be at least the starting bid');
    }

    this.current_bid = bid_amount;
    this.current_bidder_id = bidder_id;
    this.updated_at = new Date();
  }

  endAuction() {
    if (this.status !== 'active') {
      throw new Error('Auction is not active');
    }

    if (this.current_bid >= this.reserve_price) {
      this.status = 'sold';
    } else {
      this.status = 'ended';
    }

    this.updated_at = new Date();
  }

  cancelAuction(userId: string) {
    if (userId !== this.seller_id) {
      throw new Error('Only the seller can cancel the auction');
    }

    if (this.status !== 'active') {
      throw new Error('Only active auctions can be cancelled');
    }

    this.status = 'cancelled';
    this.updated_at = new Date();
  }

  isExpired(): boolean {
    return new Date() > this.end_time;
  }

  isActive(): boolean {
    return this.status === 'active' && !this.isExpired();
  }

  getTimeRemaining(): number {
    const now = new Date();
    const remaining = this.end_time.getTime() - now.getTime();
    return Math.max(0, remaining);
  }

  getTimeRemainingFormatted(): string {
    const remaining = this.getTimeRemaining();
    if (remaining === 0) return 'Expired';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h ${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  }

  getBidIncrement(): number {
    if (this.current_bid < 100) return 10;
    if (this.current_bid < 1000) return 50;
    if (this.current_bid < 10000) return 100;
    return Math.ceil(this.current_bid * 0.05); // 5% increment
  }

  getMinimumNextBid(): number {
    return this.current_bid + this.getBidIncrement();
  }

  meetsReservePrice(): boolean {
    return this.current_bid >= this.reserve_price;
  }

  getStatusDisplay(): string {
    if (this.isExpired() && this.status === 'active') {
      return 'expired';
    }
    return this.status;
  }
}
