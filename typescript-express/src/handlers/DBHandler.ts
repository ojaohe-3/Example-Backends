
import User from "../models/user";
import { DatabaseError } from '../utils/errors';
import DBContext from '../db/DBContext';
import Monitor from '../models/monitor';
import MonitorHandler from './MonitorHandler';

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
    private _monitor: MonitorHandler = MonitorHandler.instance;
    
    public constructor(){
        this._ctx = new DBContext();
    }

    public async add_monitor(monitor: Monitor):  Promise<DatabaseError | null>{
        try {
            const mm = await this._ctx.getMonitorModel();
            if(mm != null){
                this._monitor.log_database(0, 1);
                this._ctx.Transaction(mm, "insertTable", monitor);
                return null;
            }
            else{
                return {}
            }

        } catch (error) {
            console.log(error)
            return {};
        }
    }


  

    public async add_user(user: User): Promise<DatabaseError | null>{
        try {
            const um = await this._ctx.getUserModel();
            if(um != null){
                this._monitor.log_database(0, 1);
                this._ctx.Transaction(um, "insertTable", user);
                return null;
            }
            else{
                return {}
            }

        } catch (error) {
            console.log(error)
            return {};

        }
    }
    public async get_monitors(): Promise<Monitor[] | null>{
        try {
            const mm = await this._ctx.getMonitorModel();
            if(mm != null){
                this._monitor.log_database(0, 1);
                return await mm.getTables();
            }
            else{
                return null;
            }

        } catch (error) {
            console.log(error)
            return null;
        }
    }

    public async get_user(id: number): Promise<User | null>{
        try {
            const um = await this._ctx.getUserModel();
            if(um != null){
                this._monitor.log_database(1, 0);
                return await um.getRow(id);
            }
            else{
                return null;
            }

        } catch (error) {
            console.log(error)
            return null;
        }
    }
}