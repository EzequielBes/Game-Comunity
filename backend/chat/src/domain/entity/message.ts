import { v4 } from 'uuid';
import { InputSendMessage } from '../../application/usecases/send-message';



export class Messager {


  private constructor (
    readonly messageId :string,
    readonly senderUsername:  string,
    readonly recipientUsername :string,
    readonly messageContent : string,
    readonly date: Date

  ) {}

  static create (content: InputSendMessage) {
    const id = v4()
    return new Messager(id, content.senderUsername, content.recipientUsername, content.contentMessage, new Date())
  }

  static restore (messageId: string, senderUsername: string, recipientUsername: string, messageContent: string, date: Date) {
    console.log(messageId, senderUsername, recipientUsername, messageContent, date)
    return new Messager(messageId, senderUsername, recipientUsername, messageContent, date)
  }

}
