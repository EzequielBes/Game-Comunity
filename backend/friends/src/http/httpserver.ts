import express, { Request, Response } from "express"


export interface HttpServer {
  register(method:any, url:string, callback:Function):void
  listen(port:string):void
}


export class ExpressHttpServer implements HttpServer {
  app: any
  constructor () {
    this.app = express()
    this.app.use(express.json())
  }

  register(method: any, url: string, callback: Function): void {
      this.app[method], url , (request:Request, response:Response) => {
        try {
          const output = callback(request.body, request.params)
          response.json(output).status(200)
        } catch (err) {
          response.status(402)
        }
      }

  }
  listen(port: string): void {
    return this.app.listen(port)
  }

}
