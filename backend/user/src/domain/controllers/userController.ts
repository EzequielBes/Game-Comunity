import { GetUser } from "../../application/getuser_usecase";
import { Signin } from "../../application/signin_usecase";
import { Signup } from "../../application/signup_usecase";
import { AddPreference } from "../../application/usecases/addPreference";
import { GetUserPreferences } from "../../application/usecases/getUserPreferences";
import { RemovePreference } from "../../application/usecases/removePreference";
import { HttpServer } from "../../infra/http/httpserver";


export class UserController {

  constructor (
    readonly httpServer: HttpServer, 
    readonly signupUseCase: Signup, 
    readonly signin: Signin, 
    readonly getUser: GetUser,
    readonly addPreference: AddPreference,
    readonly getUserPreferences: GetUserPreferences,
    readonly removePreference: RemovePreference
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

    httpServer.register("post", "/preferences", async (body:any, params:any) => {
      const output = await addPreference.execute(body);
      return output
    })

    httpServer.register("get", "/preferences/:userId", async (body:any, params:any) => {
      const output = await getUserPreferences.execute(params.userId);
      return output
    })

    httpServer.register("delete", "/preferences/:preferenceId", async (body:any, params:any) => {
      const output = await removePreference.execute(params.preferenceId);
      return output
    })
  }
}
