import axios from "axios"


export const getAllfriends = async (userId:string) => {
  try {
    const response = await axios.get(`http://localhost:3001/listfriends?id${userId}`);
    return response.data
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

export const getPendentRequest = async (userId: string) => {

  try {
    const response = await axios.post('http://localhost:3001/listPending', {
      id: userId
    });
    const res = await response.data[0].me
    return await getUsersInformation(res)
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    throw error; // Lance o erro para que a função chamadora possa lidar com ele
  }
};


export const addfriends = async (userId:string, friendId:string) => {
  try {
    const response = await axios.post(`http://localhost:3001/addfriend`, {
      me: userId,
      friend: friendId
    });
    return response.data
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

export const getUsersInformation = async (userId:string) => {
  try {
    const response = await axios.get(`http://localhost:3002/getUser`, {
      params: {
        account_id : userId
      }
    });
    console.log(response.data.output)
    return [response.data.output]
  } catch (error) {
    console.error('Error signing up:', error);
  }
};


