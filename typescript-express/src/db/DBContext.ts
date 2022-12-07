import { Pool, PoolClient } from "pg";
import Cursor from "pg-cursor";
import User from "../models/user";
import IModel from "./model";
import UserModel from "./UserModel";

// export const MAX_ROWS = 200; TODO



export default class DBContext {
  private _pool: Pool;
  private _cursor: Cursor | null = null;
  private _user: UserModel;

  public constructor() {
    this._user = new UserModel();
    this._pool = new Pool({
      host: process.env.DB_CONNECT_STRING,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  private async connect(): Promise<PoolClient | null> {
    try {
      return await this._pool.connect();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async user(){
    const c = await this.connect();
    if (c !== null){
      
      this._user.client = c;
      return this._user;
    }
    return null;

  }


  public async Transaction<T>(
    model: IModel<T>,
    target_hook: keyof IModel<T>,
    ...args: any[]
  ) {
    const client = await this.connect();
    if (client !== null) {
      let result: any = null;
      try {
        await client.query("BEGIN");
        model.client = client;
        switch (target_hook) {
          case "getRows":
            result = await model.getRows.bind(model)(args);
            break;
          case "getRow":
            result = await model.getRow.bind(model)(args);
            break;
          case "insertTable":
            result = await model.insertTable.bind(model)(args[0]);
            break;

          default:
            throw "invalid key";
        }
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK");
      } finally {
        client.release();
      }
    }
  }
}
