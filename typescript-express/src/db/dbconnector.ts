import { Pool, PoolClient } from "pg";
import Cursor from "pg-cursor";
import User from '../models/user';

export interface Model{
    table: string,
    item?: any,
    
}

export default class DBContext{
    
    private _pool: Pool;
    private _cursor: Cursor | null = null;
    private models: {[key:string]: Model}

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
            return null
        }
    }

    public async insertTable(table: string, item: any[]){
        const client = await this.connect();
        if(client !== null){
            try {
                await client.query('BEGIN')
                await client.query('COMMIT')
            } catch (error) {
                await client.query('ROLLBACK')
            }
            
        }
    }

    public async getTables(table:string, query: any[]){

    }
}