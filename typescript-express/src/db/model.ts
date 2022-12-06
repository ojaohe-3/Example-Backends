import Cursor from "pg-cursor";
import { PoolClient } from "pg";
export default interface IModel {
  table: string;
  client?: PoolClient;
  insertTable: (item: any) => Promise<void>;
  getTables: (...querry_items: any[]) => Promise<any[]>;
  getRow: (...querry_items: any[]) => Promise<any>;
}
