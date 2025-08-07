import { Auction } from '../../../domain/entity/auction';
import { DatabaseConnection } from '../databaseConnection/database';
import { GetAuctionsFilters } from '../../../application/usecases/getAuctions';

export interface AuctionRepository {
  save(auction: Auction): Promise<void>;
  getById(auction_id: string): Promise<Auction | undefined>;
  getAuctions(filters?: GetAuctionsFilters): Promise<Auction[]>;
  update(auction: Auction): Promise<void>;
  delete(auction_id: string): Promise<void>;
  getActiveAuctions(): Promise<Auction[]>;
  getExpiredAuctions(): Promise<Auction[]>;
}

export class AuctionRepositoryDatabase implements AuctionRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async save(auction: Auction): Promise<void> {
    await this.databaseConnection.query(
      'INSERT INTO "auctions" (auction_id, post_id, seller_id, starting_bid, reserve_price, current_bid, current_bidder_id, status, start_time, end_time, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      [
        auction.auction_id,
        auction.post_id,
        auction.seller_id,
        auction.starting_bid,
        auction.reserve_price,
        auction.current_bid,
        auction.current_bidder_id,
        auction.status,
        auction.start_time,
        auction.end_time,
        auction.created_at,
        auction.updated_at
      ]
    );
  }

  async getById(auction_id: string): Promise<Auction | undefined> {
    const [auctionData] = await this.databaseConnection.query(
      'SELECT * FROM "auctions" WHERE auction_id = $1',
      [auction_id]
    );

    if (!auctionData) return undefined;

    return Auction.restore(
      auctionData.auction_id,
      auctionData.post_id,
      auctionData.seller_id,
      auctionData.starting_bid,
      auctionData.reserve_price,
      auctionData.current_bid,
      auctionData.current_bidder_id,
      auctionData.status,
      new Date(auctionData.start_time),
      new Date(auctionData.end_time),
      new Date(auctionData.created_at),
      new Date(auctionData.updated_at)
    );
  }

  async getAuctions(filters?: GetAuctionsFilters): Promise<Auction[]> {
    let query = 'SELECT * FROM "auctions" WHERE 1=1';
    let params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.seller_id) {
      query += ` AND seller_id = $${paramIndex}`;
      params.push(filters.seller_id);
      paramIndex++;
    }

    if (filters?.active_only) {
      query += ` AND status = 'active' AND end_time > NOW()`;
    }

    if (filters?.min_price) {
      query += ` AND current_bid >= $${paramIndex}`;
      params.push(filters.min_price);
      paramIndex++;
    }

    query += ' ORDER BY end_time ASC';

    if (filters?.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters?.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const auctionsData = await this.databaseConnection.query(query, params);

    return auctionsData.map((auctionData: any) =>
      Auction.restore(
        auctionData.auction_id,
        auctionData.post_id,
        auctionData.seller_id,
        auctionData.starting_bid,
        auctionData.reserve_price,
        auctionData.current_bid,
        auctionData.current_bidder_id,
        auctionData.status,
        new Date(auctionData.start_time),
        new Date(auctionData.end_time),
        new Date(auctionData.created_at),
        new Date(auctionData.updated_at)
      )
    );
  }

  async update(auction: Auction): Promise<void> {
    await this.databaseConnection.query(
      'UPDATE "auctions" SET current_bid = $1, current_bidder_id = $2, status = $3, updated_at = $4 WHERE auction_id = $5',
      [
        auction.current_bid,
        auction.current_bidder_id,
        auction.status,
        auction.updated_at,
        auction.auction_id
      ]
    );
  }

  async delete(auction_id: string): Promise<void> {
    await this.databaseConnection.query(
      'DELETE FROM "auctions" WHERE auction_id = $1',
      [auction_id]
    );
  }

  async getActiveAuctions(): Promise<Auction[]> {
    const auctionsData = await this.databaseConnection.query(
      'SELECT * FROM "auctions" WHERE status = \'active\' AND end_time > NOW() ORDER BY end_time ASC',
      []
    );

    return auctionsData.map((auctionData: any) =>
      Auction.restore(
        auctionData.auction_id,
        auctionData.post_id,
        auctionData.seller_id,
        auctionData.starting_bid,
        auctionData.reserve_price,
        auctionData.current_bid,
        auctionData.current_bidder_id,
        auctionData.status,
        new Date(auctionData.start_time),
        new Date(auctionData.end_time),
        new Date(auctionData.created_at),
        new Date(auctionData.updated_at)
      )
    );
  }

  async getExpiredAuctions(): Promise<Auction[]> {
    const auctionsData = await this.databaseConnection.query(
      'SELECT * FROM "auctions" WHERE status = \'active\' AND end_time <= NOW()',
      []
    );

    return auctionsData.map((auctionData: any) =>
      Auction.restore(
        auctionData.auction_id,
        auctionData.post_id,
        auctionData.seller_id,
        auctionData.starting_bid,
        auctionData.reserve_price,
        auctionData.current_bid,
        auctionData.current_bidder_id,
        auctionData.status,
        new Date(auctionData.start_time),
        new Date(auctionData.end_time),
        new Date(auctionData.created_at),
        new Date(auctionData.updated_at)
      )
    );
  }
} 