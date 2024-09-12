import { ReceivedMessage } from "../application/usecases/receive-message";
import { SendMessage } from "../application/usecases/send-message";
import { HttpServer } from "../infra/http/httpserver";


export class MessageController {

  constructor (
    readonly httpServer : HttpServer,
    readonly sendMessage : SendMessage,
    readonly receiveMessage : ReceivedMessage
  ) {
    this.httpServer.register("post", "/send-message", async (body:any, params:string) => {
      const output = await sendMessage.execute(body);
      return output
    })
    this.httpServer.register("post", "/getmessages", async (body:any, params:any) => {
      const output = await receiveMessage.execute(body);
      return output
    })
  }
}
