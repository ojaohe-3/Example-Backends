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
    public async insertTable(item: UserSchema): Promise<number | null> {
        if (this._client !== null) {
            try {
                const text =
                    "INSERT INTO Users(first_name, last_name, email, password, created_at, updated_at, last_login, admin) VALUES($1,$2,$3,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$5) RETURNING id";
                // cursor.read
                const { rows } =  await this._client!.query(text, [
                    item.first_name,
                    item.last_name,
                    item.email,
                    item.password,
                    false
                ]);
                this._client?.release();
                return rows[0];
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("no connection object!");
        }
        return null;
    }
    public async getTables(): Promise<UserSchema[]> {
        if (this._client !== null) {
            try {
                const text = "SELECT * From Users";
                // cursor.read
                const { rows } = await this._client!.query(text);
                this._client?.release()
                return rows;
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
    
                const { rows } = await this._client!.query(text, [uid]);
                this._client?.release()

                return rows[0];
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
