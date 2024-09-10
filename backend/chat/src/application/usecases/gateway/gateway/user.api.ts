import axios from "axios";
import { UserDto } from "../../../../domain/Dto/userDto";

export interface UserGateway {
  getUser(name:string):Promise<UserDto | undefined>
}

export class AxiosUserGateway implements UserGateway {
   constructor () {}

  async getUser(name: string): Promise<UserDto | undefined> {
    console.log(name)
    try {
      const response = await axios.get(`http://localhost:3002/getUser`, {
        params: { username: name }
      });
      return response.data.output;
    } catch (error) {

      return ;
    }
  }


}
