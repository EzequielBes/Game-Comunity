import  express, {Express, Response, Request}  from 'express';
import {createServer} from 'http'

export interface HttpServer {
  register(method:string, url:string, callback:Function):void;
  listen(port:string):void
}

export class ServerHttpExpress implements HttpServer{
  app:any
  http:any
  constructor () {
    this.app = express()
    this.app.use(express.json())
    this.http = createServer(this.app)
  }


  register(method: string, url: string, callback: Function): void {
    this.app[method], url, async (request:Request, response:Response) => {
      try {
        const output = await callback(request.body, request.params);
        response.json(output).status(200)
      } catch (err: any) {
        response.status(422).json({message: err.message})
      }
    }
  }
  listen(port: string): void {
    return this.app.listen(port)
  }
}
