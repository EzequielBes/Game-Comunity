import { UserRepositoryDatabase } from "../infra/database/repository/userRepository";


export class GetUser {
  constructor (readonly databaseConnection: UserRepositoryDatabase) {}

  async execute (input:{account_id: string}) {
    console.log(input.account_id)
    const getUser = await this.databaseConnection.getById(input.account_id);
    if(!getUser) return "usuario nao encontrado";
    return {
      username: getUser.username,
      account_id: getUser.account_id
    }
  }
}
