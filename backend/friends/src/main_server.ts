import { FriendsController } from "./domain/controller/addfriends.controller";

import { AddFriend } from "./application/usecases/addfriend";
import { ListPendent } from "./application/usecases/listPendent_usecase";
import { ListFriends } from "./application/usecases/listfriends_usecase";
import { PostgresDatabaseConnection } from "./database/databaseConnection/database";
import { FriendsDatabaseRepository } from "./database/repository/addFriendRepository";
import { ExpressHttpServer } from "./http/httpserver";



const httpServer = new ExpressHttpServer()

const databaseConnection = new PostgresDatabaseConnection()
const friendRepository = new FriendsDatabaseRepository(databaseConnection)

const listfriends = new ListFriends(friendRepository)
const addfriend = new AddFriend(friendRepository)
const listPendingRequested = new ListPendent(friendRepository)
new FriendsController(httpServer, addfriend, listfriends, listPendingRequested)

httpServer.listen("3001")
