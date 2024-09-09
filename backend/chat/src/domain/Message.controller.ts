import { SendMessage } from "../application/send-message";
import { HttpServer } from "../infra/http/httpserver";


export class MessageController {

  constructor (
    readonly httpServer : HttpServer,
    readonly sendMessage : SendMessage
  ) {
    this.httpServer.register("post", "/send-message", async (body:any, params:string) => {
      const output = await sendMessage.execute(body);
      return output
    })
  }
}
