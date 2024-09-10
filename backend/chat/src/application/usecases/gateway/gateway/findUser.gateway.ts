
import { UserDto } from "../../../../domain/Dto/userDto";
import { AxiosUserGateway } from "./user.api";


export class Account {

  constructor () {}

  async findUser (name:string): Promise<UserDto | undefined> {
      const output = await new AxiosUserGateway().getUser(name)
      if (!output) return;
      return output
  }
}
