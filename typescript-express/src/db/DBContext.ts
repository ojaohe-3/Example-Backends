import { Pool, PoolClient } from "pg";
import Cursor from "pg-cursor";
import User from "../models/user";
import IModel from "./model";
import UserModel from "./usermodel";
import MonitorModel from "./MonitorModel";

// export const MAX_ROWS = 200; TODO

interface IModels {
  User: UserModel;
  Monitor: MonitorModel;
}

export default class DBContext {
  private _pool: Pool;
  private _cursor: Cursor | null = null;
  private _models: IModels;

  public constructor() {
    this._models = {
      User: new UserModel(),
      Monitor: new MonitorModel(),
    };
    this._pool = new Pool({
      host: process.env.DB_CONNECT_STRING,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  private async connect(): Promise<PoolClient | null> {
    try {
      return await this._pool.connect();
    } catch (error) {
      return null;
    }
  }

  public async getUserModel(): Promise<UserModel | null> {
    const client = await this.connect();
    if (client !== null) {
      this._models.User.client = client;
      return this._models.User;
    } else {
      return null;
    }
  }

  public async getMonitorModel(): Promise<MonitorModel | null> {
    const client = await this.connect();
    if (client !== null) {
      this._models.Monitor.client = client;
      return this._models.Monitor;
    } else {
      return null;
    }
  }

  public async Transaction(
    model: IModel,
    target_hook: keyof IModel,
    ...args: any[]
  ) {
    const client = await this.connect();
    if (client !== null) {
      let result : any= null;
      try {
        await client.query("BEGIN");
        model.client = client;
        switch (target_hook) {
          case "getTables":
            result = await model.getTables(args);
            break;
          case "getRow":
            result = await model.getRow(args);
            break;
          case "insertTable":
            result = await model.insertTable(args);
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
