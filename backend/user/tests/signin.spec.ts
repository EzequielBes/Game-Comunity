import { generateJsonWebToken } from "../src/infra/authentication/jwt_auth"
import { PostgresDatabase } from "../src/infra/database/databaseConnection/database"
import { UserRepositoryDatabase } from "../src/infra/database/repository/userRepository"
import { CryptoPassword } from "../src/utils/generageHashedPassword"


test("Deve fazer login e gerar json web token", async () => {
  const input = {
    email: "Ezequieltbeserra@gmail.com",
    password: "4002BemTestado@"
  }
  const database = new PostgresDatabase()
  const repository = new UserRepositoryDatabase(database)

  const account = await repository.getByEmail(input.email);
  const getPasswordFromAccount = await account.password.getValue()

  const decript = await CryptoPassword.decrypt(input.password, getPasswordFromAccount)
  const accountData = {
    name: account.getName(),
    username: account.getUsername(),
    email: account.getEmail(),
    account_id: account.account_id
  }
  const genereateJson = await generateJsonWebToken(account.account_id, account.getName(),  account.getUsername(),   account.getEmail())
  console.log(genereateJson)
  expect(decript).toBe(true)
  expect(generateJsonWebToken).toBeDefined()


})

test("Deve tentar fazer login com senha errada e dar false", async () => {
  const input = {
    email: "Ezequieltbeserra@gmail.com",
    password: "23232@"
  }
  const database = new PostgresDatabase()
  const repository = new UserRepositoryDatabase(database)

  const account = await repository.getByEmail(input.email);
  const getPasswordFromAccount = await account.password.getValue()

  const decript = await CryptoPassword.decrypt(input.password, getPasswordFromAccount)
  expect(decript).toBe(false)


})
