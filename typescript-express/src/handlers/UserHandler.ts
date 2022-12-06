import User from "../models/user"
import MonitorHandler from "./monitorhandler";
import DBHandler from './DBHandler';

const MAX_USERS = 1_000 // should be selected to 1. minimize database usage, while maintaining good loadfactor for its work memory
const MAX_LIFETIME_MS = 500_000; // Max lifetime for a user, should be within the expected time of a user.
type UserMap = {[key: string] : User}
export default class UserHandler{
    // Signelton Pattern
    private static _instance: UserHandler | null = null;
    public static get instance(){
        if(this._instance == null){
            this._instance = new UserHandler();
        }
        return this._instance;
    }

    private _users: UserMap;
    private _monitor: MonitorHandler;
    private _db: DBHandler;

    public constructor(){
        this._users = {};
        this._db = DBHandler.instance;
        this._monitor =  MonitorHandler.instance;

        // flush operation, helps mittaga
    }

    /// Flushes out cached users that existed for longer then MAX_LIFETIME
    private flush(){
        Object.entries(this._users).filter((([key, user]) => {
            if(user.timestamp && user.timestamp < Date.now() - MAX_LIFETIME_MS){
                
            }
        }))
    }

    /// First flushes out cached users that existed for longer then MAX_LIFETIME, if its still too large, sort the array by timestamp and then simply remove the oldest half
    private flush_overflow(){
        this.flush();
        if(Object.keys(this._users).length > MAX_USERS){

            // Expensive operation, removes half of the earliest users
            const sorted = Object.entries(this._users).sort(([k1, u1],[k2,u2]) => u1.timestamp! - u2.timestamp! )
            sorted.forEach(([k,u], i) => {
                if(i < sorted.length / 2){
                    delete this._users[k]
                }
            })
        }
    }

    public addUser(user: User){
        user.timestamp = Date.now()
        this._users[user.uid] = user;
    }
}