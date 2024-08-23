import { ServerHttpExpress } from "./infra/http/httpserver";
import { SocketAdapter } from "./infra/websocket/socket";


const server = new ServerHttpExpress()

const socket = new SocketAdapter()
socket.start(server.http)

server.http.listen(3005, () => {
  console.log("O servidor esta correndo na porta 3004")
})
