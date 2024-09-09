import { SendMessage } from "./application/usecases/send-message";
import { MessageController } from "./domain/Message.controller";
import { connectionMongoDb } from "./infra/database/connection";
import Registry from "./infra/di/Registry";
import { ServerHttpExpress } from "./infra/http/httpserver";
import { MessageRepositoryDatabase } from "./infra/repository/messagerepo";
import { SocketAdapter } from "./infra/websocket/socket";


const server = new ServerHttpExpress()

const socket = new SocketAdapter()
socket.start(server.http)


const database = new connectionMongoDb("http://localhost:27017/messages", "message")
Registry.getInstance().provide("databaseRepository", database)
const messageDatabase = new MessageRepositoryDatabase()
const sendMessageUseCase = new SendMessage(messageDatabase)
const messagesController = new MessageController(server, sendMessageUseCase)

server.http.listen(3005, () => {
  console.log("O servidor esta correndo na porta 3005")
})
