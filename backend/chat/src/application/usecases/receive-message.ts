import { Messager } from "../../domain/entity/message";
import { MessageRepositoryDatabase } from "../../infra/repository/messagerepo";


export class ReceivedMessage {

  constructor (readonly messageDatabase: MessageRepositoryDatabase) {}

  async execute (input:any) {
    const getMessages = await this.messageDatabase.getMessages(input.person1, input.person2)
    const msg = Messager.restore(getMessages.messageId,getMessages.senderUsername, getMessages.recipientUsername, getMessages.messageContent, getMessages.date )
    return msg
  }
}
