import * as dotenv from "dotenv"
import { Signup } from "./application/signup_usecase";
import { UserController } from "./domain/controllers/userController";
import { PostgresDatabase } from "./infra/database/databaseConnection/database";
import { UserRepositoryDatabase } from "./infra/database/repository/userRepository";
import { ExpressHttpServer } from "./infra/http/httpserver";


const connectionDatabase = new PostgresDatabase()
const databaseRepository = new UserRepositoryDatabase(connectionDatabase)
const server = new ExpressHttpServer()

const userSignup = new Signup(databaseRepository)
const userController = new UserController(server, userSignup)

server.listen("3002")
