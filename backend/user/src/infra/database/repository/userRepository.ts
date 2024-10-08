import { Account } from "../../../domain/entity/save_user";
import { DatabaseConnection } from "../databaseConnection/database";


export interface UserRepository {
  getByEmail(email:string): Promise<Account | undefined>;
  saveAccount(account: Account):Promise<void>;
  delete(email: string): Promise<void>;
  getById(account_id:string): Promise<Account | undefined>;
  getByName(username:string): Promise<Account | undefined>;

}


export class UserRepositoryDatabase implements UserRepository{

  constructor (readonly databaseConnection: DatabaseConnection) {}
    async getByName(username: string): Promise<Account | undefined> {
      const [accountData] = await this.databaseConnection.query('SELECT * FROM "user_table" WHERE username = $1  ', [username])
      if(!accountData) return
      return Account.restore(accountData.account_id, accountData.name, accountData.username, accountData.email, accountData.password)
    }

  async getById(account_id: string) {
    const [accountData] = await this.databaseConnection.query('SELECT * FROM "user_table" WHERE account_id = $1', [account_id]);
    if(!accountData) return
    return Account.restore(accountData.account_id, accountData.name, accountData.username, accountData.email, accountData.password)
  }

  async getByEmail(email: string) {
    const [accountData] = await this.databaseConnection.query('SELECT * FROM "user_table" WHERE email = $1  ', [email])
    if(!accountData) return
    return Account.restore(accountData.account_id, accountData.name, accountData.username, accountData.email, accountData.password)
  }

  async saveAccount(account: Account):Promise<void> {
    await this.databaseConnection.query('INSERT INTO "user_table" (account_id, username, name, email , password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ',[account.account_id, account.getName(), account.getUsername(), account.getEmail(), await account.getPassword(), new Date(), new Date()]);

  }

  async delete(email: string): Promise<void> {
    await this.databaseConnection.query('DELETE FROM "usuarios" WHERE email', [email])
  }


}

export type UserLoginInformation = {
  account_id: string,
  username:string,
  name:string
  password:string,
  email:string
}
