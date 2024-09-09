
export default interface DatabaseConection {
  query(): void;
  close(): void;
}

export class MongoDatabaseConection implements DatabaseConection {


  query(): void {
    throw new Error("Method not implemented.");
  }
  close(): void {
    throw new Error("Method not implemented.");
  }

}
