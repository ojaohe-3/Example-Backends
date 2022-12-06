import IModel from "./model";
import { PoolClient } from "pg";
import Monitor from "../models/monitor";

// This is incase, some type transformation needs to be done
export type MonitorSchema = Monitor;

export default class MonitorModel implements IModel {
  private _client: PoolClient | undefined;

  public set client(value: PoolClient) {
    this._client = value;
  }

  public get table(): string {
    return "Monitor";
  }
  public async insertTable(item: MonitorSchema): Promise<void> {}
  public async getTables(): Promise<MonitorSchema[]> {
    return [];
  }
  public async getRow(uid: string): Promise<MonitorSchema[]> {
    return [];
  }
}
