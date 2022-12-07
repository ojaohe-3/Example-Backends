import Cursor from "pg-cursor";
import { DatabaseError, PoolClient } from "pg";

export type DBResult<T> = [T | null | undefined, DatabaseError | null | undefined]
export type DBResults<T> = [T[] | null | undefined, DatabaseError | null | undefined]
export default interface IModel<T> {
  client?: PoolClient;
  insertTable: <K>(item: any) => Promise<DBResult<K>>;
  getRows: (...querry_items: any[]) => Promise<DBResults<T>>;
  getRow: (...querry_items: any[]) => Promise<DBResult<T>>;
}
