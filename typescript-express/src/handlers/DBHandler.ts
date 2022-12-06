import { Pool, PoolClient } from "pg";
import Cursor from "pg-cursor";
import User from "../models/user";
import { DatabaseError } from '../utils/errors';

export default class DBHandler{
    // Signelton Pattern
    private static _instance: DBHandler | null = null;
    public static get instance(){
        if(this._instance == null){
            this._instance = new DBHandler();
        }
        return this._instance;
    }
 
    private _pool: Pool;
    private _cursor: Cursor | null = null;

    public constructor(){
        this._pool = new Pool({
            host: process.env.DB_CONNECT_STRING,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          });
    }

    private async connect(): Promise<PoolClient | null>{
        try {
            return await this._pool.connect();
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    private exists_in_table(table, id): boolean{
        return false;
    }

    private map_to_model(item){

    }

    private async query(){

    }

    public add_user(user: User): DatabaseError | null{
        if(this.exists_in_table("User", user.uid)){
            return null;
        }

        return {}
    }
}