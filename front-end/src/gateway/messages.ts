import axios from "axios";


export const sendMessages = async (senderUsername: string, recipientUsername: string, contentMessage: string ) => {
  try {
    const response = await axios.post('http://localhost:3005/send-message', {
      senderUsername,
      recipientUsername,
      contentMessage
    });
    return response.data
  } catch (error) {
    console.log("Message not sended")
  }
};

export const getMessages = async ( user1: string, user2: string) => {
  try {
    const response = await axios.post('http://localhost:3005/getmessages', {
      "user1" : user1,
      "user2": user2
    });
    return response.data
  } catch (error) {
    console.log("nao foi possivel acessar as mensagens")

}
}
