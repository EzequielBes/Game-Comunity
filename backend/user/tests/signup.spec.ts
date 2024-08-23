import { DatabaseConnection, PostgresDatabase } from './../src/infra/database/databaseConnection/database';
import { UserRepositoryDatabase } from "../src/infra/database/repository/userRepository"
import { Account } from '../src/domain/entity/save_user';
import { Signup } from '../src/application/signup_usecase';



test("Deve criar um usuario passando pelo use case" ,  async () => {
  const input = {
    name: "Ezequiel",
    username: "Zeze",
    email : "Ezequieltbeserra@gmail.com",
    password: "4002BemTestado@"
  }
  const databaseConnection = new PostgresDatabase()
  const databaserepository = new UserRepositoryDatabase(databaseConnection);

  const signup = new Signup(databaserepository)
  const signupUseCase = signup.execute(input)
  expect(signupUseCase).toBe("Account created")
})

test("Deve retornar email invalido" ,  async () => {
  const input = {
    name: "Ezequiel",
    username: "Zeze",
    email : "Ezequieltbeserragmail.com",
    password: "4002BemTestado@"
  }
  const databaseConnection = new PostgresDatabase()
  const databaserepository = new UserRepositoryDatabase(databaseConnection);

  const signup = new Signup(databaserepository)
  const signupUseCase = signup.execute(input)
  await expect(() => signupUseCase).rejects.toThrow(new Error("Email not valid"))
})

test("Deve retornar email invalido passando por todos os componentes" ,  async () => {
  const input = {
    name: "Ezequiel",
    username: "Zeze",
    email : "Ezequieltbeserragmail.com",
    password: "4002BemTestado@"
  }
  const databaseConnection = new PostgresDatabase()
  const databaserepository = new UserRepositoryDatabase(databaseConnection);

  const account =  Account.create(input.name, input.username, input.email, input.password);
  databaserepository.saveAccount(account)

  expect(account).toBeDefined()
})




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
