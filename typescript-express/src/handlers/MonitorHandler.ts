import Monitor from '../models/monitor';
export default class MonitorHandler{
    // Signelton Pattern
    private static _instance: MonitorHandler | null = null;
    public static get instance(){
        if(this._instance == null){
            this._instance = new MonitorHandler();
        }
        return this._instance;
    }
}