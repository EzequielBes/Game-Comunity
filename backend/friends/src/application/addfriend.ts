
import { FriendsDatabase } from "../database/repository/addFriendRepository";
import { Friend } from "../entity/createFriendship";



export class AddFriend {

  constructor (
    readonly databaseConnection : FriendsDatabase
  ) {}

  async execute (input:friend) {
    const sendedRequestFriend = await this.databaseConnection.findFriendship(input.me, input.friend);
    if(sendedRequestFriend) throw new Error("Request friend already exists")
    const receivedRequestFriend = await this.databaseConnection.findFriendship(input.friend, input.me)
    if(receivedRequestFriend) {
      const acceptRequest = await Friend.accept(input.me, input.friend)
      this.databaseConnection.createfriend(acceptRequest);
      this.databaseConnection.updatefriend(input.friend, input.me)
      return "Pedido de amizade aceito"
    }
    const sendFriendRequest = await Friend.sendfriendRequest(input.me, input.friend)
    await this.databaseConnection.createfriend(sendFriendRequest)
    return "Pedido de amizade enviado com sucesso"
  }

}


export type friend = {
  me: string,
  friend: string
}
