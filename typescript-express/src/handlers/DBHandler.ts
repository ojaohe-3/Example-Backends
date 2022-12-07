import User from "../models/user";
import DBContext from "../db/DBContext";
import Monitor from "../models/monitor";
import MonitorHandler from "./MonitorHandler";
import { DatabaseError } from 'pg';
import { DBResult, DBResults } from '../db/model';

export default class DBHandler {
  // Signelton Pattern
  private static _instance: DBHandler | null = null;
  public static get instance() {
    if (this._instance === null) {
      this._instance = new DBHandler();
    }
    return this._instance;
  }

  private _ctx: DBContext;

  public constructor() {
    this._ctx = new DBContext();
  }


  // I was thinking of making it to some sort of factory pattern where you call a factory to get a particualr operation rather then to hardcode it like this. 
  // For time sake this is acceptable or it is going to be too large.
  public async add_user(user: Partial<User>): Promise<DBResult<number>> {
    try {
      const um = await this._ctx.user();

      if (um != null) {
        MonitorHandler.instance.monitor.database_writes += 1;
        return await this._ctx.Transaction(um, "insertTable", user);
      }
    } catch (error) {
      console.log(error);
    }
    return [null, new DatabaseError("failed to add user to database", 30, "error")];
  }

  public async get_user(id: number): Promise<DBResult<User>> {
    try {
      const um = await this._ctx.user();
      if (um != null) {
        MonitorHandler.instance.monitor.database_reads += 1;
        return await um.getRow(id);
      }
    } catch (error) {
      console.log(error);
    }
    return [null, new DatabaseError("failed to add user to database", 30, "error")];
  }

  public async get_users(): Promise<DBResults<User>> {
    try {
      const um = await this._ctx.user();
      if (um != null) {
        MonitorHandler.instance.monitor.database_reads += 1;
        return await um.getRows();
      }
    } catch (error) {
      console.log(error);
    }
    return [null, new DatabaseError("failed to add user to database", 30, "error")];
  }
}
