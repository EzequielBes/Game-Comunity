
import { UserDto } from "../../../../domain/Dto/userDto"
import { inject } from "../../../../infra/di/Registry"
import { UserGateway } from "./user.api"


export class User {
  @inject("userGateway")
  readonly userGateway!: UserGateway
  constructor () {}

  async findUser (name:string): Promise<UserDto | null> {
      const output = await this.userGateway.getUser(name)
      return output
  }
}
