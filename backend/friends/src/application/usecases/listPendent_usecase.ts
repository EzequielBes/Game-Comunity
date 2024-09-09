import { FriendsDatabaseRepository } from "../../database/repository/addFriendRepository";

export class ListPendent {
  constructor(readonly connectionDatabase: FriendsDatabaseRepository) {}

  async execute(account_id: string) {
    console.log(account_id)
    const pendentRequest = await this.connectionDatabase.pendentRequests(
      account_id
    );
    if (!pendentRequest) return;
    return pendentRequest;
  }
}
