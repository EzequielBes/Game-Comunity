import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken"
import { Account } from '../../domain/entity/save_user';

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}

export const generateJsonWebToken = async (account_id:string, name:string, username:string, email:string ):Promise<string> => {
  const accountData = {
    account_id,
    name,
    username,
    email
  }
  const token = jwt.sign(accountData, secretKey, {expiresIn: '12h'})
  return token
}


interface User {
  account_id: string,
  name: string,
  username: string
  email:string,
}
