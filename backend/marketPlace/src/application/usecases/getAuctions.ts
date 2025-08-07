import { AuctionRepository } from '../../infra/database/repository/auctionRepository';

export class GetAuctions {
  constructor(readonly auctionRepository: AuctionRepository) {}

  async execute(): Promise<any[]> {
    return await this.auctionRepository.getAuctions();
  }
}

export interface GetAuctionsFilters {
  status?: string;
  seller_id?: string;
  category?: string;
  min_price?: number;
  max_price?: string;
  active_only?: boolean;
  limit?: number;
  offset?: number;
}
