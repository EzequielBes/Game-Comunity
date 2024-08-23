import express, { Request, Response } from "express";
import cors from "cors";

export interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: string): any;
}

export class ExpressHttpServer implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());

  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async (request: Request, response: Response) => {
      try {
        const output = await callback(request.body, request.query);
        response.status(200).json({ output });
      } catch (error: any) {
        response.status(500).json({ error: error.message });
      }
    });
  }

  listen(port: string) {
    console.log(`Server listening on port ${port}`);
    this.app.listen(port);
  }
}
