import { Pool, PoolClient } from "pg";
import Cursor from "pg-cursor";
import User from "../models/user";
import QuerryObject from "./QuerryObject";
import UserQuerryObject from "./UserQuerryObject";
import dotenv from 'dotenv'
dotenv.config();

// export const MAX_ROWS = 200; TODO



export default class DBContext {
  private static _instance: DBContext | null = null;
  public static get instance() {
    if (this._instance === null) {
      this._instance = new DBContext();
    }
    return this._instance;
  }


  private _pool: Pool;
  private _cursor: Cursor | null = null;
  private _user: UserQuerryObject;

  public constructor() {
    this._user = new UserQuerryObject();
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

  public async user(): Promise<UserQuerryObject | null>{
    const c = await this.connect();
    if (c !== null){
      
      this._user.client = c;
      return this._user;
    }
    return null;

  }


  public async Transaction<T>(
    model: QuerryObject<T>,
    target_hook: keyof QuerryObject<T>,
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
            result = await model.getRow.bind(model)(args[0]);
            break;
          case "insertRow":
            result = await model.insertRow.bind(model)(args[0]);
            break;
          case "deleteRow":
            result = await model.deleteRow.bind(model)(args[0]);
            break
          default:
            throw "invalid key";
        }
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK");
        client.release();

      } 
    }
  }
}
