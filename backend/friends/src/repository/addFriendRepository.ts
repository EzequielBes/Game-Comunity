import { DatabaseConnection } from "../databaseConnection/database";


export interface FriendsDatabase {
  findFriendship(me:string, friend: string):Promise<any>;
  createfriend(friend: Friend):Promise<void>;
  updatefriend(friend: string, me : string) : Promise<void>
  removefriend(me: string, friend:string):Promise<void>;
}


export class FriendsDatabaseRepository implements FriendsDatabase {

  constructor(
    readonly databaseConnection : DatabaseConnection
  ) {}

  async updatefriend(friend: string, me: string): Promise<void> {
    await  this.databaseConnection.query('UPDATE "friendships" SET status = $1 WHERE me = $2 AND friend = $3', ['accepted', friend , me])
  }


  findFriendship(me: string, friend: string): Promise<any> {
    const friends = this.databaseConnection.query('SELECT * FROM "friendships" WHERE me = $1 AND friend = $2',
    [me, friend])
    return friends
  }
  async createfriend(friend: Friend): Promise<void> {
    await this.databaseConnection.query('INSERT INTO "friendships" (friend_ship_id, me, friend, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6)', [friend.friendshipid, friend.me, friend.friend, friend.status, new Date(), new Date()])
  }

  removefriend(me: string, friend: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

}

export type Friend = {
  friendshipid : string,
  me : string,
  friend : string,
  status: string,
}
