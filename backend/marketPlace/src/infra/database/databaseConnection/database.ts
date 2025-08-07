import dotenv from "dotenv";
import pgp from "pg-promise";
dotenv.config();

export interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  none(statement: string, params: any): Promise<void>;
  oneOrNone(statement: string, params: any): Promise<any>;
  manyOrNone(statement: string, params: any): Promise<any[]>;
  tx<T>(cb: (t: any) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export class PostgresDatabase implements DatabaseConnection {
  connection: any
  constructor () {
    this.connection = pgp()("postgresql://postgres:postgres@localhost:5432/marketplace")
  }

  query(statement: string, params: any): Promise<any> {
      return this.connection.query(statement, params);
  }

  none(statement: string, params: any): Promise<void> {
    return this.connection.none(statement, params);
  }

  oneOrNone(statement: string, params: any): Promise<any> {
    return this.connection.oneOrNone(statement, params);
  }

  manyOrNone(statement: string, params: any): Promise<any[]> {
    return this.connection.manyOrNone(statement, params);
  }

  tx<T>(cb: (t: any) => Promise<T>): Promise<T> {
    return this.connection.tx(cb);
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }

}

