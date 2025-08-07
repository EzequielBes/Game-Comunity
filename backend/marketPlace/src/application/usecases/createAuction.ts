import { Auction } from '../../domain/entity/auction';
import { AuctionRepository } from '../../infra/database/repository/auctionRepository';

export class CreateAuction {
  constructor(readonly auctionRepository: AuctionRepository) {}

  async execute(input: CreateAuctionInput): Promise<string> {
    const auction = Auction.create(
      input.post_id,
      input.seller_id,
      input.starting_bid,
      input.reserve_price,
      input.duration_hours
    );

    await this.auctionRepository.save(auction);
    return "Auction created successfully";
  }
}

export interface CreateAuctionInput {
  post_id: string;
  seller_id: string;
  starting_bid: number;
  reserve_price: number;
  duration_hours?: number;
}
