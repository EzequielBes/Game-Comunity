import { DatabaseConnection, PostgresDatabase } from './../src/infra/database/databaseConnection/database';
import { UserRepositoryDatabase } from "../src/infra/database/repository/userRepository"
import { Account } from '../src/domain/entity/save_user';



test("Deve criar um usuario" ,  async () => {
  const input = {
    name: "Ezequiel",
    username: "Zeze",
    email : "Ezequieltbeserra@gmail.com",
    password: "4002BemTestado@"
  }
  const databaseConnection = new PostgresDatabase()
  const databaserepository = new UserRepositoryDatabase(databaseConnection);

  const account = Account.create(input.name, input.username, input.email, input.password);
  const saveAccount = await databaserepository.saveAccount(account)

  expect(account).toBeDefined()

})
