import { v4 as uuidv4 } from 'uuid';

export class Friend {
  private constructor (
    readonly friendshipid: string,
    readonly me:string,
    readonly friend:string,
    readonly status: string
  ) {}

  static async accept (me: string, friend: string) {
    const friendshipid = uuidv4()
    return new Friend(friendshipid , me, friend, "accepted")
  }

  static async sendfriendRequest (me: string, friend: string) {
    const friendshipid = uuidv4()
    return new Friend(friendshipid , me, friend, "pending")
  }



}
