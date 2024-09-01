import axios from "axios"


export const signupUser = async ( name, username, email, password ) => {
  try {
    const response = await axios.post('http://localhost:3002/signup', {
      name,
      username,
      email,
      password
    });
    console.log('User signed up:', response.data);
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

export const signinUser = async ( email, password ) => {
  try {
    const response = await axios.post('http://localhost:3002/signin', {
      email,
      password
    });
    console.log('User signed up:', response.data);
    return response.data
  } catch (error) {
    console.error('Error signing up:', error);
  }
};



const signin = async ({email, password}) => {
  try {
    const response = await axios.post('http://localhost:3001/signin', {
      email,
      password
    });
    return response.data
  } catch (error) {
    return error
  }

}
