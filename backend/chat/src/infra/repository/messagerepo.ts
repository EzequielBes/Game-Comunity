import { InputSendMessage } from "../../application/usecases/send-message";
import { connectionMongoDb } from "../database/connection";
import { inject } from "../di/Registry";


export interface MessageRepository {
  saveMessage(content: InputSendMessage): Promise<void>;
  getMessages(person1:string, person2:string): Promise<void>;
}

export class MessageRepositoryDatabase implements MessageRepository {
  @inject("databaseRepository")
  readonly databaseRepository!: connectionMongoDb


  constructor () {}

  async saveMessage(message: any): Promise<void> {
    const collection = await this.databaseRepository.getColletion('message')
    console.log(`collection`)
    await collection.insertOne({
      message_id: message.messageId,
			sender_username :message.senderUsername,
			recipient_username: message.recipientUsername,
			message_content: message.messageContent,
			date: message.date
    })
  }

  async getMessages(person1: string, person2: string): Promise<any> {
    const collection = await this.databaseRepository.getColletion("message");

    const messages = await collection.find({
      $or: [
        { sender_username: person1, recipient_username: person2 },
        { sender_username: person2, recipient_username: person1 }
      ]
    }).toArray();
    return messages;
  }


}
