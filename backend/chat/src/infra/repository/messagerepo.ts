import { InputSendMessage } from "../../application/usecases/send-message";
import { connectionMongoDb } from "../database/connection";
import { inject } from "../di/Registry";


export interface MessageRepository {
  saveMessage(content: InputSendMessage): Promise<void>;
  deleteMessage(): Promise<void>;
}

export class MessageRepositoryDatabase implements MessageRepository {
  @inject("databaseRepository")
  readonly databaseRepository!: connectionMongoDb


  constructor () {}

  async saveMessage(message: any): Promise<void> {
    const collection = await this.databaseRepository.getColletion('message')
    await collection.insertOne({
      messageId: message.messageId,
			senderUsername :message.senderUsername,
			recipientUsername: message.recipientUsername,
			messageContent: message.messageContent,
			date: message.date
    })
  }

  deleteMessage(): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
