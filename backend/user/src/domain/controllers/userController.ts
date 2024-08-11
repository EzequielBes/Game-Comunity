import { Signup } from "../../application/signup_usecase";
import { HttpServer } from "../../infra/http/httpserver";


export class UserController {

  constructor (
    readonly httpServer: HttpServer, readonly signupUseCase: Signup
  ) {

    httpServer.register("post", "/signup", async (body:any, params:any) => {
      const output = await signupUseCase.execute(body);
      return output
    })
  }
}
