import IModel, { DBResults } from "./model";
import User from "../models/user";
import { DatabaseError, PoolClient } from "pg";
import { DBResult } from './model';

export type UserSchema = User;

export default class UserModel implements IModel<UserSchema> {
    private _client: PoolClient | null = null;
    
    public set client(value: PoolClient) {
        this._client = value;
    }
    
    
  public async insertTable<K>(item: any): Promise<DBResult<K>>{
    if (this._client !== null) {
        try {
          const text =
            "INSERT INTO Users(first_name, last_name, email, password, updated_at, last_login, created_at) VALUES($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP ,CURRENT_TIMESTAMP) RETURNING id";
  
          const { rows } = await this._client!.query(text, [
            item.first_name,
            item.last_name,
            item.email,
            item.password,
          ]);
          this._client?.release();
          return [rows[0], null];
        } catch (error: any) {
        //   console.log(error);
  
          return[null, error as DatabaseError];
        }
      } else {
        console.log("no connection object!");
        return[null,new DatabaseError("No valid connection object found",33,"error")];
      }
  }
  public async getRows(): Promise<DBResults<UserSchema>> {
    if (this._client !== null) {
      try {
        const text = "SELECT * From Users";
        // cursor.read
        const { rows } = await this._client.query(text);
        this._client?.release();
        return [rows, null];
      } catch (error: any) {
        return [null, error as DatabaseError]
      }
    } else {
      console.log("no connection object!");
      return [null, new DatabaseError("No valid connection object found",33, "error")];
    }
  }
  public async getRow(uid: number): Promise<DBResult<UserSchema>> {
    if (this._client !== null) {
      try {
        const text = "SELECT * From Users where id = $1";
        const { rows } = await this._client.query(text, [uid]);
        this._client?.release();

        return [rows[0], null];
      } catch (error: any) {
        return [null,error as DatabaseError];
      }
    } else {
      console.log("no connection object!");
      return [null, new DatabaseError("No valid connection object found",33, "error")];
    }
  }
}
