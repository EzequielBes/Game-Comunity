import { Messager } from "../../domain/entity/message";
import { MessageRepositoryDatabase } from "../../infra/repository/messagerepo";


export class ReceivedMessage {

  constructor (readonly messageDatabase: MessageRepositoryDatabase) {}

  async execute (input:any) {
    const getMessages = await this.messageDatabase.getMessages(input.user1, input.user2)
    let messages = []
    for(let i in getMessages) {
      messages.push(Messager.restore(getMessages[i].message_id, getMessages[i].sender_username, getMessages[i].recipient_username, getMessages[i].message_content, getMessages[i].date))
    }

    return messages
  }
}
