import express, { Request, Response } from "express";

export interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: string): any;
}

export class ExpressHttpServer implements HttpServer {
  app;
  constructor() {
    this.app = express;
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method],
      url,
      (request: Request, response: Response) => {
        try {
          const output = callback(request.body, request.params);
          response.json({ output }).status(200);
        } catch (error) {
          response.json({ error: error.message });
        }
      };
  }
  listen(port: string) {
    this.app.listen(port)
  }
}
