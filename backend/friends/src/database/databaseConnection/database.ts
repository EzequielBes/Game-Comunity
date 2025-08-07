import pgp from "pg-promise";

export interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>;
}

export class PostgresDatabase implements DatabaseConnection {
  connection: any
  constructor () {
    this.connection = pgp()("postgresql://postgres:postgres@localhost:5432/friends")
  }

  query(statement: string, params: any): Promise<any> {
      return this.connection.query(statement, params);
  }
  close(): Promise<void> {
    return this.connection.$pool.end();
  }

}
