import IDatabase from "./IDatabase";
import MemoryDatabase from "./MemoryDatabase";

interface IDatabaseConstructor {
  connect(connection: string): void;
  getInstance(): IDatabase | undefined;
}

class Database implements IDatabaseConstructor {
  private db!: IDatabase;

  constructor() {
    this.connect();
  }

  connect(connection: string | undefined = undefined): void {
    switch (connection) {
      default:
        this.db = new MemoryDatabase();
        break;
    }
  }

  getInstance(): IDatabase {
    return this.db;
  }
}

const database = new Database();
export default database.getInstance();
