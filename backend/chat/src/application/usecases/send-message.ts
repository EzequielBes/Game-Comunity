import { Messager } from "../../domain/entity/message";
import { User } from "./gateway/gateway/findUser.gateway";


export class SendMessage {


  constructor () {}

  async execute (input: InputSendMessage) {
    const userInstance = new User()
    const senderAccount = await userInstance.findUser(input.senderUsername);
    const recipientAccount = await userInstance.findUser(input.recipientUsername);
    if (!senderAccount) throw new Error("This account not exists");
    if(!recipientAccount) throw new Error("Recipient not founded")

    const msg = Messager.create(input);



  }

}



export type InputSendMessage = {
  senderUsername: string,
  recipientUsername: string,
  contentMessage: string
}
