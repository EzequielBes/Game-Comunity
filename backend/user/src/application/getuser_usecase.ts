import { UserRepositoryDatabase } from "../infra/database/repository/userRepository";


export class GetUser {
  constructor (readonly databaseConnection: UserRepositoryDatabase) {}

  async execute (input:{account_id: string, username: string}) {
    if(input.account_id) {
    const getUser = await this.databaseConnection.getById(input.account_id);
    if(!getUser) throw new Error("User not found") ;
    return {
      username: getUser.getUsername(),
      account_id: getUser.account_id
    }
    }
    const getUser = await this.databaseConnection.getByName(input.username);
    if(!getUser) throw new Error("User not found")
    return {
      username: getUser.getUsername(),
      account_id: getUser.account_id
    }

  }
}
