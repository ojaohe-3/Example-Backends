export default class DBHandler{
    // Signelton Pattern
    private static _instance: DBHandler | null = null;
    public static get instance(){
        if(this._instance == null){
            this._instance = new DBHandler();
        }
        return this._instance;
    }
    
}