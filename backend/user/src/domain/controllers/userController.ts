import { GetUser } from "../../application/getuser_usecase";
import { Signin } from "../../application/signin_usecase";
import { Signup } from "../../application/signup_usecase";
import { HttpServer } from "../../infra/http/httpserver";


export class UserController {

  constructor (
    readonly httpServer: HttpServer, readonly signupUseCase: Signup, readonly signin: Signin, readonly getUser: GetUser
  ) {

    httpServer.register("post", "/signup", async (body:any, params:any) => {
      const output = await signupUseCase.execute(body);
      return output
    })

    httpServer.register("post", "/signin", async (body:any, params:any) => {
      const output = await signin.execute(body);
      return output
    })

    httpServer.register("get", "/getUser", async (body:any, params:any) => {
      const output = await getUser.execute(params);
      return output
    })
  }
}
