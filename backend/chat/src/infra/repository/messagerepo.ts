import { InputSendMessage } from "../../application/usecases/send-message";


export interface MessageRepository {
  saveMessage(content: InputSendMessage): Promise<void>;
  deleteMessage(): Promise<void>;
}

export class MessageRepositoryDatabase implements MessageRepository {


  saveMessage(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteMessage(): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
