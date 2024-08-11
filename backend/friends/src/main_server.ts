import { AddFriend } from "./application/addfriend";
import { FriendsController } from "./domain/controller/addfriends.controller";
import { PostgresDatabaseConnection } from "./infra/database/databaseConnection/database";
import { FriendsDatabaseRepository } from "./infra/database/repository/addFriendRepository";
import { ExpressHttpServer } from "./http/httpserver";


const httpServer = new ExpressHttpServer()

const databaseConnection = new PostgresDatabaseConnection()
const friendRepository = new FriendsDatabaseRepository(databaseConnection)

const addfriend = new AddFriend(friendRepository)
const friendController = new FriendsController(httpServer, addfriend)

httpServer.listen("3001")
