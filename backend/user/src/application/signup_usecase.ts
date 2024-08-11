import { Account } from "../domain/entity/save_user";
import { UserRepository } from "../infra/database/repository/userRepository";


export class Signup {

  constructor (readonly databaseConnection: UserRepository) {}

  async execute (input: User) {
    const accountExists = await this.databaseConnection.getByEmail(input.email);
    if(accountExists) throw new Error("Account already exists");
    const account = Account.create(input.name, input.username, input.email, input.password);
    const saveAccount = this.databaseConnection.saveAccount(account);
}

}


export interface User {
  username: string,
  name: string,
  email:string,
  password: string,
}
