import { Bid } from '../../../domain/entity/bid';
import { DatabaseConnection } from '../databaseConnection/database';

export interface BidRepository {
  save(bid: Bid): Promise<void>;
  getByAuctionId(auction_id: string): Promise<Bid[]>;
  getByBidderId(bidder_id: string): Promise<Bid[]>;
  getHighestBid(auction_id: string): Promise<Bid | undefined>;
}

export class BidRepositoryDatabase implements BidRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async save(bid: Bid): Promise<void> {
    await this.databaseConnection.query(
      'INSERT INTO "bids" (bid_id, auction_id, bidder_id, bid_amount, created_at) VALUES ($1, $2, $3, $4, $5)',
      [
        bid.bid_id,
        bid.auction_id,
        bid.bidder_id,
        bid.bid_amount,
        bid.created_at
      ]
    );
  }

  async getByAuctionId(auction_id: string): Promise<Bid[]> {
    const bidsData = await this.databaseConnection.query(
      'SELECT * FROM "bids" WHERE auction_id = $1 ORDER BY bid_amount DESC, created_at ASC',
      [auction_id]
    );

    return bidsData.map((bidData: any) =>
      Bid.restore(
        bidData.bid_id,
        bidData.auction_id,
        bidData.bidder_id,
        bidData.bid_amount,
        new Date(bidData.created_at)
      )
    );
  }

  async getByBidderId(bidder_id: string): Promise<Bid[]> {
    const bidsData = await this.databaseConnection.query(
      'SELECT * FROM "bids" WHERE bidder_id = $1 ORDER BY created_at DESC',
      [bidder_id]
    );

    return bidsData.map((bidData: any) =>
      Bid.restore(
        bidData.bid_id,
        bidData.auction_id,
        bidData.bidder_id,
        bidData.bid_amount,
        new Date(bidData.created_at)
      )
    );
  }

  async getHighestBid(auction_id: string): Promise<Bid | undefined> {
    const [bidData] = await this.databaseConnection.query(
      'SELECT * FROM "bids" WHERE auction_id = $1 ORDER BY bid_amount DESC, created_at ASC LIMIT 1',
      [auction_id]
    );

    if (!bidData) return undefined;

    return Bid.restore(
      bidData.bid_id,
      bidData.auction_id,
      bidData.bidder_id,
      bidData.bid_amount,
      new Date(bidData.created_at)
    );
  }
} 