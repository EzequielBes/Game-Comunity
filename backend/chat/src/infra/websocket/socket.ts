import { Server, Socket } from "socket.io"


export class SocketAdapter {
  private io!:any
  constructor () {}
  users:any = {}
  async start (server:any) {
    this.io = new Server(server, {
      cors: {
        origin : "*"
      }
    })


   this.io.on("connection", (socket:Socket) => {

    socket.on("registerAccountId", (accountId) => {
      this.users[accountId.trim()] = socket.id;
      console.log(`account_id ${accountId} registrado com socket ID ${socket.id}`);
    })

    socket.on("send-message", (payload: interfaceProps) => {
      this.io.to(this.users[payload.recipient]).emit("message-received", {content: payload.message, sender : payload.sender, timestamp: payload.timestamp})
    } )

   })
  }
}


type interfaceProps = {
  recipient : string,
  sender : string,
  message : string,
  timestamp : Date,
}
