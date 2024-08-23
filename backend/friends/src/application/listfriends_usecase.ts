import { FriendsDatabase } from "../database/repository/addFriendRepository";



export class ListFriends {

  constructor (readonly databaseConnection: FriendsDatabase) {}

  async execute (userId:string) {
    const listfriends =  await this.databaseConnection.findAllFriends(userId)
    if(!listfriends) return ;
    return listfriends
  }
}
