import * as dotenv from "dotenv"
import { Signup } from "./application/signup_usecase";
import { UserController } from "./domain/controllers/userController";
import { PostgresDatabase } from "./infra/database/databaseConnection/database";
import { UserRepositoryDatabase } from "./infra/database/repository/userRepository";
import { ExpressHttpServer } from "./infra/http/httpserver";
import { Signin } from "./application/signin_usecase";
import { GetUser } from "./application/getuser_usecase";
import { AddPreference } from "./application/usecases/addPreference";
import { GetUserPreferences } from "./application/usecases/getUserPreferences";
import { RemovePreference } from "./application/usecases/removePreference";
import { PreferenceRepositoryDatabase } from "./infra/database/repository/preferenceRepository";


const connectionDatabase = new PostgresDatabase()
const databaseRepository = new UserRepositoryDatabase(connectionDatabase)
const preferenceRepository = new PreferenceRepositoryDatabase(connectionDatabase)
const server = new ExpressHttpServer()

const userSignup = new Signup(databaseRepository)
const userSignin = new Signin(databaseRepository)
const getUser = new GetUser(databaseRepository)
const addPreference = new AddPreference(preferenceRepository)
const getUserPreferences = new GetUserPreferences(preferenceRepository)
const removePreference = new RemovePreference(preferenceRepository)

new UserController(server, userSignup, userSignin, getUser, addPreference, getUserPreferences, removePreference)

server.listen("3002")
