import QuerryObject, { DBResults } from "./QuerryObject";
import User from "../models/user";
import { DatabaseError, Pool, PoolClient } from "pg";
import { DBResult } from './QuerryObject';
import MonitorHandler from "../handlers/MonitorHandler";

export type UserSchema = User;

export default class UserQuerryObject implements QuerryObject<UserSchema> {
	
	private _pool: Pool;

	public constructor(pool: Pool){
		this._pool = pool
	}
	
	private async connect(){
		try {
			
			return await this._pool.connect();
		} catch (error) {
			console.log(error)
			return null;
		}
	}
	
	public async insertRow<K>(item: any): Promise<DBResult<K>> {
		const client = await this.connect();
		if (client !== null) {
			try {
				const text =
					"INSERT INTO Users(first_name, last_name, email, password, updated_at, last_login, created_at)\
					VALUES($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP ,CURRENT_TIMESTAMP) RETURNING id";
					
					const { rows } = await client!.query(text, [
						item.first_name,
						item.last_name,
						item.email,
						item.password,
					]);
					client?.release();
					return [rows[0]['id'], null];
				} catch (error: any) {
					//   console.log(error);
					client?.release();
					return [null, error as DatabaseError];
				}
			} else {
				console.log("no connection object!");
				return [null, new DatabaseError("No valid connection object found", 32, "error")];
			}
		}
		
		public async getRows(): Promise<DBResults<UserSchema>> {
			const client = await this.connect();
			if (client !== null) {
				try {

					const text = "SELECT * From Users";
					// cursor.read
					const { rows } = await client.query(text);
					client?.release();
					return [rows, null];
				} catch (error: any) {
					client?.release();
					return [null, error as DatabaseError]
			}
		} else {
			console.log("no connection object!");
			return [null, new DatabaseError("No valid connection object found", 32, "error")];
		}
	}
	public async getRow(uid: number): Promise<DBResult<UserSchema>> {
		const client = await this.connect();
		if (client !== null) {
			try {

				const text = "SELECT * From Users where id = $1";
				const { rows } = await client.query(text, [uid]);
				client?.release();
				
				return [rows[0], null];
			} catch (error: any) {
				client?.release();
				return [null, error as DatabaseError];
			}
		} else {
			console.log("no connection object!");
			return [null, new DatabaseError("No valid connection object found", 32, "error")];
		}
	} 
	
	public async deleteRow(uid: number): Promise<DBResult<any>>{

		const client = await this.connect();
		if (client !== null) {
			try {
				const text = "DELETE FROM Users WHERE id = $1";
				const res= await client.query(text, [uid]);
				client?.release();
				
				return [res, null];
			} catch (error: any) {
				client?.release();
				return [null, error as DatabaseError];
			}
		} else {
			console.log("no connection object!");
			return [null, new DatabaseError("No valid connection object found", 32, "error")];
		}
	};
	
}
