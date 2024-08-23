import { AddFriend } from "./application/addfriend";
import { FriendsController } from "./domain/controller/addfriends.controller";

import { ExpressHttpServer } from "./http/httpserver";
import { ListFriends } from "./application/listfriends_usecase";
import { PostgresDatabaseConnection } from "./database/databaseConnection/database";
import { FriendsDatabaseRepository } from "./database/repository/addFriendRepository";
import { ListPendent } from "./application/listPendent_usecase";


const httpServer = new ExpressHttpServer()

const databaseConnection = new PostgresDatabaseConnection()
const friendRepository = new FriendsDatabaseRepository(databaseConnection)

const listfriends = new ListFriends(friendRepository)
const addfriend = new AddFriend(friendRepository)
const listPendingRequested = new ListPendent(friendRepository)
new FriendsController(httpServer, addfriend, listfriends, listPendingRequested)

httpServer.listen("3001")
