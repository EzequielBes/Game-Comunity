import { Messager } from "../../domain/entity/message";
import { MessageRepositoryDatabase } from "../../infra/repository/messagerepo";
import { Account } from "../gateway/gateway/findUser.gateway";


export class SendMessage {

  constructor (readonly messageDatabase: MessageRepositoryDatabase) {}

  async execute (input: InputSendMessage) {
    const userInstance = new Account()
    const senderAccount = await userInstance.findUser(input.senderUsername);
    if (!senderAccount) throw new Error("This account not exists");
    const recipientAccount = await userInstance.findUser(input.recipientUsername);
    if(!recipientAccount) throw new Error("Recipient not founded")
    const msg = Messager.create(input);
    await this.messageDatabase.saveMessage(msg)

  }
}



export type InputSendMessage = {
  senderUsername: string,
  recipientUsername: string,
  contentMessage: string
}
