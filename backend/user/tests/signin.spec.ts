import { DatabaseConnection } from './../src/infra/database/databaseConnection/database';
import { generateJsonWebToken } from "../src/infra/authentication/jwt_auth";
import { PostgresDatabase } from "../src/infra/database/databaseConnection/database";
import { UserRepositoryDatabase } from "../src/infra/database/repository/userRepository";
import { CryptoPassword } from "../src/utils/generageHashedPassword";
import { Signin } from '../src/application/signin_usecase';

let signin: Signin
beforeEach(async () => {
  const database = new PostgresDatabase()
  const accountRepository = new UserRepositoryDatabase(database)
  signin = new Signin(accountRepository)
})
test ("Deve fazer login e gerar json web token", async () =>  {
  const input = {
    email: "Ezequieltbeserra@gmail.com",
    password: "4002BemTestado@"
  }
  const outputSignin = await signin.execute(input)

  expect(outputSignin).toBeDefined()
})

test ("Deve tentar logar mas a senha esta errada", async () =>  {
  const input = {
    email: "Ezequieltbeserra@gmail.com",
    password: "40020@"
  }
  await expect(() => signin.execute(input)).rejects.toThrow(new Error("Usuario ou senha incorretos"))
})



test("Deve passar por todos os objetos e gerar json web token", async () => {
  const input = {
    email: "Ezequieltbeserra@gmail.com",
    password: "4002BemTestado@"
  }
  const database = new PostgresDatabase()
  const repository = new UserRepositoryDatabase(database)
  const account = await repository.getByEmail(input.email);
  const getPasswordFromAccount = account!.password.getValue()
  const decriptPassword = await CryptoPassword.decrypt(input.password, getPasswordFromAccount)
  const jsonWebToken = await generateJsonWebToken(account!.account_id, account!.getName(),  account!.getUsername(),   account!.getEmail())

  expect(decriptPassword).toBe(true)
  expect(jsonWebToken).toBeDefined()
})

test("Deve tentar fazer login com senha errada e dar usuario ou senha invalidos", async () => {
  const input = {
    email: "Ezequieltbeserra@gmail.com",
    password: "23232@"
  }
  const database = new PostgresDatabase()
  const repository = new UserRepositoryDatabase(database)
  const account = await repository.getByEmail(input.email);
  const getPasswordFromAccount = account!.password.getValue()
  const decript = await CryptoPassword.decrypt(input.password, getPasswordFromAccount)
  expect(account).toBeDefined()
  expect(decript).toBe(false)

})

test("Deve tentar fazer login com email nao existente", async () => {
  const input = {
    email: "ezequiee@gmail.com",
    password: "23232@"
  }
  const database = new PostgresDatabase()
  const repository = new UserRepositoryDatabase(database)
  const account = await repository.getByEmail(input.email);

  expect(account).toBeFalsy()
})

