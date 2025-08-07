import { AuctionRepository } from '../../infra/database/repository/auctionRepository';

export class EndAuction {
  constructor(readonly auctionRepository: AuctionRepository) {}

  async execute(auctionId: string): Promise<string> {
    const auction = await this.auctionRepository.getById(auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }

    auction.endAuction();
    await this.auctionRepository.update(auction);
    return "Auction ended successfully";
  }
}
