// socket.ts
import { io, Socket as SocketIOClientSocket } from "socket.io-client";
import { AppSocket } from "./socketadapter";

class Socket implements AppSocket {
  private static instance: Socket;
  private _socket: SocketIOClientSocket | null = null;

  private constructor() {
    this.connect();
  }

  public static getInstance(): Socket {
    if (!Socket.instance) {
      Socket.instance = new Socket();
    }
    return Socket.instance;
  }

  public get socket(): SocketIOClientSocket {
    if (!this._socket) {
      throw new Error("Socket is not connected.");
    }
    return this._socket;
  }

  public connect(): void {
    if (!this._socket) {
      this._socket = io("http://localhost:3005");
     this._socket.emit("connection")
    }
  }

  public disconnect(): void {
    if (this._socket) {
      this._socket.disconnect();
      this._socket = null;
    }
  }

  public emit(eventname: string, body: any): void {
    if (this._socket) {
      this._socket.emit(eventname, body);
    }
  }

  public on(eventname: string, callback: (data: any) => any): void {
    if (this._socket) {
      this._socket.on(eventname, callback);
    }
  }

  public off(eventname: string, callback: (data: any) => any): void {
    if (this._socket) {
      this._socket.on(eventname, callback);
    }
  }
}

export default Socket.getInstance();
