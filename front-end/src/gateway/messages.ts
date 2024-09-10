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
    console.log("mensagens nao foram acessadas")
  }
};

export const receiveMessages = async ( user1: string, user2: string) => {
  try {
    const response = await axios.post('http://localhost:3005/send-message', {
      user1,
      user2,
    });
    return response.data
  } catch (error) {
    console.log("mensagens nao foram acessadas")
  }
};
