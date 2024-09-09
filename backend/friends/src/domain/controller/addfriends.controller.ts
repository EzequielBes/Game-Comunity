
import { AddFriend } from "../../application/usecases/addfriend";
import { ListFriends } from "../../application/usecases/listfriends_usecase";
import { ListPendent } from "../../application/usecases/listPendent_usecase";
import { HttpServer } from "../../http/httpserver";


export class FriendsController {

  constructor (
    readonly httpServer : HttpServer,
    readonly addfriend : AddFriend,
    readonly listFriends : ListFriends,
    readonly listPendingRequested : ListPendent
  ) {

    this.httpServer.register("post", "/addfriend", async (body:any, params:any) => {

      const output = await addfriend.execute(body)
      return output
    })

    this.httpServer.register("get", "/listfriends", async (body:any, params:any) => {
      const output = await listFriends.execute(params)
      return output
    })

    this.httpServer.register("post", "/listPending", async (body: any, params:any) => {
      const account_id = body.id.trim()
      const output = await listPendingRequested.execute(account_id)
      return output
    })
  }
}
