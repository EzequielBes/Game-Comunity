import { generateJsonWebToken } from '../infra/authentication/jwt_auth';
import { CryptoPassword } from '../utils/generageHashedPassword';
import { UserRepositoryDatabase } from './../infra/database/repository/userRepository';


export class Signin {
constructor (readonly connectionDatabase: UserRepositoryDatabase) {}

  async execute(input: SigninDto) {
    try {
      const account = await this.connectionDatabase.getByEmail(input.email)
      if(!account) throw new Error("Account not exists");
      const databasePassword = account.password.getValue();
      const decriptPassword = await CryptoPassword.decrypt(input.password, databasePassword);

      if(decriptPassword == false) throw new Error("Usuario ou senha incorretos");
      return generateJsonWebToken(account.account_id, account.getName(), account.getUsername(), account.getEmail())
    } catch (err:any) {
      return {"erro" : err.message}
    }

  }
}

export interface SigninDto {
  email: string,
  password: string
}
