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
      console.log(`ss`)
      const output = await sendMessage.execute(body);
      return output
    })
    this.httpServer.register("get", "/receive-message", async (body:any, params:any) => {
      const output = await receiveMessage.execute(params);
      return output
    })
  }
}
