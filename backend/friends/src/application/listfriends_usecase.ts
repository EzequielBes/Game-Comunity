import { FriendsDatabase } from "../database/repository/addFriendRepository";



export class ListFriends {

  constructor (readonly databaseConnection: FriendsDatabase) {}

  async execute (userId:string) {
    const friends =  await this.databaseConnection.findAllFriends(userId)
    if(!friends) return ;
    return friends
  }
}
