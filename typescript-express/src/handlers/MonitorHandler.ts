import Monitor from '../models/monitor';
import { Avg, within_range, MovingAverage, Stg } from '../utils/math_utils';
import DBHandler from './DBHandler';
const MAX_WINDOW_SIZE = 1_000;
const LOG_METRIC_EVER_MS = 5_000;
export default class MonitorHandler{
    // Signelton Pattern
    private static _instance: MonitorHandler | null = null;
    public static get instance(){
        if(this._instance == null){
            this._instance = new MonitorHandler();
        }
        return this._instance;
    }

    private _monitors: Monitor[] = [];
    private _db: DBHandler = DBHandler.instance;
    
    public constructor(){
        // TODO fetch from database
        const intial_monitor: Monitor = {
            response_times: [],
            id: 0,
            timestamp: new Date(),
            requests_total: 0,
            error_requests: 0,
            successfull_requests: 0,
            message_rate: 0,
            avg_response_time: 0,
            std_response_time: 0,
            outgoing_requests: 0,
            outgoing_requests_rate: 0,
            database_writes: 0,
            database_reads: 0,
            database_write_rate: 0,
            database_read_rate: 0
        } 
        this._monitors.push(intial_monitor)
        setInterval(this.log_metrics, LOG_METRIC_EVER_MS);
    }

    private log_metrics(){
        if(this._monitors.length + 1 > MAX_WINDOW_SIZE){
            this._monitors.shift();
        }
        const current = this.get_current();
        const avg = Avg(current.response_times || []);
        const std = Stg(current.response_times || []);
        // log metrics
        const new_monitor : Monitor= {
            ...current,
            response_times: [],
            id: current.id + 1,
            timestamp: new Date(),
            successfull_requests: current.successfull_requests,
            message_rate: Avg(MovingAverage(this._monitors.map(m => m.requests_total), 10)),
            outgoing_requests_rate: 0,
            database_write_rate:  Avg(MovingAverage(this._monitors.map(m => m.database_writes), 10)),
            database_read_rate:  Avg(MovingAverage(this._monitors.map(m => m.database_reads), 10)),
            avg_response_time: avg,
            std_response_time: std,
        }
        if(this.is_different_from_latest(new_monitor)){
            this._db.add_monitor(new_monitor);
        }
    }

    private is_different_from_latest(m: Monitor){
        const current = this.get_current();

        // @ts-ignore
        let diff = (    within_range(current.message_rate, m.message_rate) +
                        within_range(current.avg_response_time, m.avg_response_time) +
                        within_range(current.std_response_time, m.std_response_time) +
                        within_range(current.outgoing_requests_rate, m.outgoing_requests_rate) +
                        within_range(current.database_write_rate, m.database_write_rate) +
                        within_range(current.database_read_rate, m.database_read_rate));
        return diff > 0; // if any metric has significatly changed 
        }

    private get_current(){
        return this._monitors[this._monitors.length - 1];
    }


    public log_response_time(time: number){
        this.get_current().response_times?.push(time);
    }

    public log_database(dr: number, dw: number){
        this.get_current().database_reads += dr;
        this.get_current().database_writes += dw;
    }

}