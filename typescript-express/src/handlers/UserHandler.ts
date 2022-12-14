import User from "../models/user";

import { DatabaseError } from "pg";
import { DBResult } from "../db/QuerryObject";
import DBContext from "../db/DBContext";
import MonitorHandler from "./MonitorHandler";

const MAX_USERS = 10_000; // max users to Cache
const MAX_LIFETIME_MS = 500_000; // Max lifetime for a cached user

type UserMap = { [key: string]: User };
export default class UserHandler {
	// Signelton Pattern
	private static _instance: UserHandler | null = null;
	public static get instance() {
		if (this._instance === null) {
			this._instance = new UserHandler();
		}
		return this._instance;
	}

	private _users: UserMap = {};

	/// Flushes out cached users that existed for longer then MAX_LIFETIME
	private flush() {
		Object.values(this._users).map((user) => {
			if (user.timestamp && (user.timestamp + MAX_LIFETIME_MS) < Date.now()) {
				delete this._users[user.id];
			}
		});
	}

	/// First flushes out cached users that existed for longer then MAX_LIFETIME, 
	/// if its still too large, sort the array by timestamp and then simply remove the oldest half
	/// The amortized cost should be around linear time for flushing.
	private flush_overflow() {
		this.flush();
		if (this.length > MAX_USERS) {
			// Expensive operation, removes half of the earliest users
			const sorted = Object.entries(this._users).sort(
				([k1, u1], [k2, u2]) => u1.timestamp! - u2.timestamp!
			);
			sorted.forEach(([k, u], i) => {
				if (i < sorted.length / 2) {
					delete this._users[k];
				}
			});
		}
	}

	public async add_user(
		user: Partial<User>, add_db = true
	): Promise<DatabaseError | null | undefined> {
		user.timestamp = Date.now();
		//#region  Testing
		if (add_db === false) {
			this._users[user.id!] = { ...user } as User;
			this.flush_overflow();
			// for testing making sure no db entries are inserted
			return null;
		}
		//#endregion
		// Query to insert to database
		const query = DBContext.instance.user;
		if (query === null) {
			return new DatabaseError("failed to get connector", 23, "error");
		}
		MonitorHandler.instance.monitor.database_writes += 1;
		const [id, error] = await query.insertRow<number>(user);
		if (id) {
			user.id = id;
			// map unconstrained to constrained
			const tmp = { ...user } as User;
			this._users[user.id!] = tmp;
			this.flush_overflow();

			return null;
		}
		return error;
	}

	public async get_all(): Promise<Partial<User>[]> {
		const query = DBContext.instance.user;
		if (query === null) {
			console.log("no connector");
			return [];
		}
		MonitorHandler.instance.monitor.database_reads += 1;

		const [users, error] = await query.getRows();
		if (error) {
			console.log(error);
			return [];
		}
		users?.forEach((u) => (this._users[u.id] = u));
		const res = Object.values(this._users).map((v) => {
			let temp: Partial<User> = { ...v }; // shallow copy
			// cleans output
			delete temp.admin;
			delete temp.timestamp;
			delete temp.password;
			return temp;
		})

		this.flush_overflow();

		return res;
	}

	public async get_user(id: number): Promise<DBResult<User>> {
		if (this._users[id]) {
			return [this._users[id], null];
		} else {
			const query = DBContext.instance.user;
			if (query === null) {
				return [null, new DatabaseError("failed to get connector", 23, "error")];
			}
			MonitorHandler.instance.monitor.database_reads += 1;
			const [user, error] = await query.getRow(id);
			if (user) {
				user.timestamp = Date.now();
				this._users[user.id] = user
			}
			return [user, error];
		}
	}

	public async delete_user(id: number, db: boolean = true): Promise<DBResult<any>> {
		delete this._users[id];
		if (db === false) {
			return [{}, null];
		}
		MonitorHandler.instance.monitor.database_writes += 1;

		const query = DBContext.instance.user;
		if (query === null) {
			return [null, new DatabaseError("failed to get connector", 23, "error")];
		}
		return await query.deleteRow(id);
	}

	public get length() {
		return Object.keys(this._users).length;
	}
}
