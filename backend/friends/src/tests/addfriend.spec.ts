import { PostgresDatabaseConnection } from "../database/databaseConnection/database"
import { FriendsDatabaseRepository } from "../database/repository/addFriendRepository"
import { Friend } from "../entity/createFriendship"





test("Devo adicionar um amigo", async () => {

  const input = {
    me: "1",
    friend: "2"
  }
  const database = new PostgresDatabaseConnection()
  const friendRepository = new FriendsDatabaseRepository(database)
  const makeFriend = await Friend.sendfriendRequest(input.me, input.friend)
  const createFriendRequest = await friendRepository.createfriend(makeFriend);

  const searchForFriendInDatabase = await friendRepository.findFriendship(input.me, input.friend);
  expect(searchForFriendInDatabase).toBeDefined()


})

test("Devo aceitar um pedido de amizade", async () => {

  const input = {
    me: "2",
    friend: "1"
  }
  const database = new PostgresDatabaseConnection()
  const friendRepository = new FriendsDatabaseRepository(database)

  const receivedRequest = await Friend.accept(input.me, input.friend)
  const accept = await friendRepository.createfriend(receivedRequest)


  const updateFriendRequest = await friendRepository.updatefriend(input.friend, input.me)

  const searchForFriendInDatabase = await friendRepository.findFriendship(input.me, input.friend);
  expect(searchForFriendInDatabase).toBeDefined()

})





