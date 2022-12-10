import { DatabaseError, PoolClient } from "pg";

export type DBResult<T> = [T | null, DatabaseError | null]
export type DBResults<T> = [T[] | null , DatabaseError | null]
export default interface QuerryObject<T> {
  client?: PoolClient;
  insertRow: <K>(item: any) => Promise<DBResult<K>>;
  getRows: (...querry_items: any[]) => Promise<DBResults<T>>;
  getRow: (...querry_items: any[]) => Promise<DBResult<T>>;
  deleteRow: (item: any) => Promise<DBResult<any>>;
}
