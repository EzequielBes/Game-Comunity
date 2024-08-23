
import { Friend } from "../entity/createFriendship";
import { FriendsDatabase } from "../database/repository/addFriendRepository";



export class AddFriend {

  constructor (
    readonly databaseConnection : FriendsDatabase
  ) {}

  async execute (input:friend) {
    console.log(input)
    const sendedRequestFriend = await this.databaseConnection.findFriendship(input.me, input.friend);
    if(sendedRequestFriend) return ("Voce ja enviou um pedido de amizade para essa pessoa");
    const receivedRequestFriend = await this.databaseConnection.findFriendship(input.friend, input.me)
    if(receivedRequestFriend) {
      const accept = await Friend.accept(input.me, input.friend)
      this.databaseConnection.createfriend(accept);
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
