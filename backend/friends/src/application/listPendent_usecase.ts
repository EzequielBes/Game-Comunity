import { FriendsDatabase } from "../database/repository/addFriendRepository";

export class ListPendent {
  constructor(readonly connectionDatabase: FriendsDatabase) {}

  async execute(account_id: string) {
    const pendentRequest = await this.connectionDatabase.pendentRequests(
      account_id
    );
    if (!pendentRequest) return;
    return pendentRequest;
  }
}
