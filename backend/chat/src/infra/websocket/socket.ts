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
      console.log(this.users)
      console.log(`account_id ${accountId} registrado com socket ID ${socket.id}`);
    })

    socket.on("sendMessage", (payload) => {
      this.io.to(payload.socket.id).emit("message-received", payload.message)
    } )


   })
  }
}
