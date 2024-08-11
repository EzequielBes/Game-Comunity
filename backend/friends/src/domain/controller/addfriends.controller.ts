import { AddFriend } from "../../application/addfriend";
import { HttpServer } from "../../http/httpserver";


export class FriendsController {

  constructor (
    readonly httpServer : HttpServer,
    readonly addfriend : AddFriend
  ) {

    this.httpServer.register("post", "/addfriend", async (body:any, params:any) => {
      const output = await addfriend.execute(body)
      return output
    })
  }
}
