import { UserRepositoryDatabase } from "../infra/database/repository/userRepository";


export class GetUser {
  constructor (readonly databaseConnection: UserRepositoryDatabase) {}

  async execute (input:{account_id: string}) {
    const getUser = await this.databaseConnection.getById(input.account_id);
    if(!getUser) return "User not found";
    return {
      username: getUser.getUsername(),
      account_id: getUser.account_id
    }
  }
}
