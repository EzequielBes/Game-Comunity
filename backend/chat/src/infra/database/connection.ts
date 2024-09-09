import { MongoClient } from "mongodb";

export interface connectionDatabase {
  disconect(): Promise<void>;
  getColletion(colletionName: string) : Promise<any>
}

export class connectionMongoDb implements connectionDatabase{
  private client : MongoClient
  constructor (url: string, private dbname: string) {
    this.client = new MongoClient(url)
  }

 private async  connect () {
    await this.client.connect()
    return this.client.db(this.dbname)
  }

  async disconect () {
    await this.client.close()
  }

  async getColletion(colletionName : string) {
    const connection = await this.connect()
    const colletion = connection.collection(colletionName)
    return colletion
  }
}
