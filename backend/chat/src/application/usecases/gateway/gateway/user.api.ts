import axios from "axios"
import { UserDto } from "../../../../domain/Dto/userDto"

export interface UserGateway {
  getUser(name:string):Promise<UserDto | null>
}

export class AxiosUserGateway implements UserGateway {
  private constructor () {}

  async getUser(name: string): Promise<UserDto | null> {
     return axios.get("http://localhost:3002/getuser?name="+name).then(response => (response.data))
  }

}
