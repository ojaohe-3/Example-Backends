import Monitor from "../models/monitor";
import { Avg, Std } from "../utils/math_utils";

const LOG_METRIC_EVER_MS = 5_000;
const LOG_METRIC_EVER_S = 5;
export default class MonitorHandler {
    // Signelton Pattern
    private static _instance: MonitorHandler | null = null;
    public static get instance() {
        if (this._instance === null) {
            this._instance = new MonitorHandler();
        }
        return this._instance;
    }

    private _monitor: Monitor;

    public constructor() {
        // TODO fetch from database
        this._monitor = {
            response_times: [],
            timestamp: Date.now(),
            requests: 0,
            requests_total: 0,
            outgoing_requests_total:0,
            database_operations_total:0,
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
            database_read_rate: 0,
        };
        setInterval(this.log_metrics.bind(this), LOG_METRIC_EVER_MS);
    }

    private log_metrics() {
        // Internal Response time
        const avg = Avg(this._monitor.response_times || []) || 0;
        const std = Std(this._monitor.response_times || []) || 0;
        this._monitor.avg_response_time = avg;
        this._monitor.std_response_time = std;
        this._monitor.response_times = [];
        this._monitor.timestamp = Date.now();
        
        // Database metrics
        this._monitor.database_read_rate = this._monitor.database_reads / LOG_METRIC_EVER_S;
        this._monitor.database_write_rate  = this._monitor.database_reads / LOG_METRIC_EVER_S;
        this._monitor.database_operations_total +=   this._monitor.database_reads + this._monitor.database_reads;
        this._monitor.database_writes = 0;
        this._monitor.database_reads = 0;
        // Request metrics
        this._monitor.requests_total += this._monitor.requests;
        this._monitor.message_rate = this._monitor.requests / LOG_METRIC_EVER_S;
        this._monitor.requests = 0;
        // Outgoing metrics
        this._monitor.outgoing_requests_rate = this._monitor.outgoing_requests / LOG_METRIC_EVER_S;
        this._monitor.outgoing_requests_total += this._monitor.outgoing_requests;
        this._monitor.outgoing_requests = 0;     
    }



    public get monitor() {
        return this._monitor
    }
}
