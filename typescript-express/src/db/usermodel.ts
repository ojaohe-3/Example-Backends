import IModel from "./model";
import User from "../models/user";
import { PoolClient } from "pg";

export type UserSchema = User;

export default class UserModel implements IModel {
  private _client: PoolClient | undefined;

  public set client(value: PoolClient) {
    this._client = value;
  }

  public get table(): string {
    return "User";
  }
  public async insertTable(item: UserSchema): Promise<void> {
    if (this._client !== null) {
        try {
          const text = "INSERT INTO Users VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id";
          // cursor.read
          const result = await this.client.query(text, [item.id, item.first_name, item.last_name, item.email, item.password,item.updated_at, item.last_login, item.created_at, false]);
          
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("no connection object!");
      }
    }
  public async getTables(): Promise<UserSchema[]> {
    if (this._client !== null) {
      try {
        const text = "SELECT * From Users";
        // cursor.read
        const result = await this.client.query(text);
        return result.rows;
      } catch (error) {
        console.log(error);
        return [];
      }
    } else {
      console.log("no connection object!");
      return [];
    }
  }
  public async getRow(uid: number): Promise<UserSchema | null> {
    if (this._client !== null) {
      try {
        const text = "SELECT * From Users where id = $1";
        // cursor.read
        const result = await this.client.query(text, [uid]);
        return result.rows[0];
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      console.log("no connection object!");
      return null;
    }
  }
}
