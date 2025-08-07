import { AuctionRepository } from '../../infra/database/repository/auctionRepository';
import { BidRepository } from '../../infra/database/repository/bidRepository';
import { Bid } from '../../domain/entity/bid';

export class PlaceBid {
  constructor(
    readonly auctionRepository: AuctionRepository,
    readonly bidRepository: BidRepository
  ) {}

  async execute(input: PlaceBidInput): Promise<string> {
    const auction = await this.auctionRepository.getById(input.auction_id);
    if (!auction) {
      throw new Error("Auction not found");
    }

    const bid = Bid.create(
      input.auction_id,
      input.bidder_id,
      input.bid_amount
    );

    await this.bidRepository.save(bid);
    return "Bid placed successfully";
  }
}

export interface PlaceBidInput {
  auction_id: string;
  bidder_id: string;
  bid_amount: number;
}
