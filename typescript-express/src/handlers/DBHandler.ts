
import User from "../models/user";
import { DatabaseError } from '../utils/errors';
import DBContext from '../db/dbconnector';

export default class DBHandler{
    // Signelton Pattern
    private static _instance: DBHandler | null = null;
    public static get instance(){
        if(this._instance == null){
            this._instance = new DBHandler();
        }
        return this._instance;
    }
    
    private _ctx: DBContext;
    
    public constructor(){
        this._ctx = new DBContext();
    }



    private exists_in_table(table, id): boolean{
        return false;
    }


  

    public add_user(user: User): DatabaseError | null{
        if(this.exists_in_table("User", user.uid)){
            return null;
        }

        return {}
    }
}