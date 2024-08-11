import mariadb from "mariadb"
import dotenv from "dotenv";
import pgp from "pg-promise";
dotenv.config();

export interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>;
}

export class PostgresDatabase implements DatabaseConnection {
  connection: any
  constructor () {
    this.connection = pgp()("postgresql://postgres:root@localhost:5432/users")
  }

  query(statement: string, params: any): Promise<any> {
      return this.connection.query(statement, params);
  }
  close(): Promise<void> {
    return this.connection.$pool.end();
  }

}

