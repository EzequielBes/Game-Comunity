import { Server, Socket } from "socket.io"


export class SocketAdapter {
  private io!:any
  constructor () {}

  async start (server:any) {
    this.io = new Server(server, {
      cors: {
        origin : "*"
      }
    })
   this.io.on("connection", (socket:Socket) => {
     socket.emit(socket.id)
   })
  }
}
