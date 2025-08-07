import axios from "axios";

export const signupUser = async (name: string, username: string, email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:3002/signup', {
      name,
      username,
      email,
      password
    });
    console.log('User signed up:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.response?.data?.message || 'Erro ao criar conta');
  }
};

export const signinUser = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:3002/signin', {
      email,
      password
    });
    console.log('User signed in:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.response?.data?.message || 'Erro ao fazer login');
  }
};
