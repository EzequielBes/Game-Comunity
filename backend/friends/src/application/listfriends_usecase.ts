import { FriendsDatabase } from "../database/repository/addFriendRepository";



export class ListFriends {

  constructor (readonly databaseConnection: FriendsDatabase) {}

  async execute (userId:{id:string}) {
    const listfriends =  await this.databaseConnection.findAllFriends(userId.id)
    if(!listfriends) return ;
    return listfriends
  }
}
