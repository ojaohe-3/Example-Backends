import { DatabaseError, Pool, PoolClient } from "pg";
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


  private _user: UserQuerryObject;

  public constructor() {
    const user_pool = new Pool({
      host: process.env.DB_CONNECT_STRING,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      max: 100,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    this._user = new UserQuerryObject(user_pool);
  }


  public get user(){
    return this._user
  }


  // public async Transaction<T>(
  //   model: QuerryObject<T>,
  //   target_hook: keyof QuerryObject<T>,
  //   ...args: any[]
  // ): Promise<any> {
  //   const client = model.client || null;
  //   if (client !== null) {
  //     let result: any = null;
  //     try {
  //       await client.query("BEGIN");
  //       model.client = client;
  //       switch (target_hook) {
  //         case "getRows":
  //           result = await model.getRows.bind(model)(args);
  //           break;
  //         case "getRow":
  //           result = await model.getRow.bind(model)(args[0]);
  //           break;
  //         case "insertRow":
  //           result = await model.insertRow.bind(model)(args[0]);
  //           break;
  //         case "deleteRow":
  //           result = await model.deleteRow.bind(model)(args[0]);
  //           break
  //         default:
  //           throw "invalid key";
  //       }
  //       await client.query("COMMIT");
  //       return result;
  //     } catch (error) {
  //       await client.query("ROLLBACK");
  //       client.release();

  //     } 
  //   }
  //   return [null, new DatabaseError("No valid connection object found", 32, "error")];
  // }
}
