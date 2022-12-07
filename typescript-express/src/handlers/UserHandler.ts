import User from "../models/user";
import MonitorHandler from "./monitorhandler";
import DBHandler from "./DBHandler";
import { DatabaseError } from "pg";
import { DBResult } from "../db/model";

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
    Object.entries(this._users).filter(([key, user]) => {
      if (user.timestamp && user.timestamp < Date.now() - MAX_LIFETIME_MS) {
        delete this._users[key];
      }
    });
  }

  /// First flushes out cached users that existed for longer then MAX_LIFETIME, if its still too large, sort the array by timestamp and then simply remove the oldest half
  private flush_overflow() {
    this.flush();
    if (Object.keys(this._users).length > MAX_USERS) {
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
    user: Partial<User>
  ): Promise<DatabaseError | null | undefined> {
    user.timestamp = Date.now();
    const [id, error] = await DBHandler.instance.add_user(user);

    if (id) {
      user.id = id;
      // map unconstrained to constrained
      const tmp = { ...user } as User;
      this._users[user.id] = tmp;
      if (Object.keys(this._users).length > MAX_USERS) {
        this.flush_overflow();
      }
      return null;
    }
    return error;
  }

  public async get_all(): Promise<Partial<User>[]> {
    const [temp, error] = await DBHandler.instance.get_users();
    temp?.forEach((u) => (this._users[u.id] = u));
    return Object.values(this._users).map((v) => {
      let temp: Partial<User> = { ...v }; // shallow copy
      // cleans output
      delete temp.admin;
      delete temp.timestamp;
      delete temp.password;
      return temp;
    });
  }
  public async get_user(id: number): Promise<DBResult<User>> {
    if (this._users[id]) {
      return [this._users[id], null];
    } else {
      const [user, error] = await DBHandler.instance.get_user(id);
      if(user)
        this._users[user.id] = user
      return [user, error];
    }
  }
}
