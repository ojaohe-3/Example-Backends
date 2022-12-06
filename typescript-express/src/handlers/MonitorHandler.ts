import Monitor from "../models/monitor";
import { Avg, within_range, MovingAverage, Stg } from "../utils/math_utils";
import DBHandler from "./DBHandler";
const MAX_WINDOW_SIZE = 100;
const LOG_METRIC_EVER_MS = 5_000;
export default class MonitorHandler {
    // Signelton Pattern
    private static _instance: MonitorHandler | null = null;
    public static get instance() {
        if (this._instance === null) {
            this._instance = new MonitorHandler();
        }
        return this._instance;
    }

    private _monitors: Monitor[] = [];

    public constructor() {
        // TODO fetch from database
        const intial_monitor: Monitor = {
            response_times: [],
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
            database_read_rate: 0,
        };
        this._monitors.push(intial_monitor);
        setInterval(this.log_metrics.bind(this), LOG_METRIC_EVER_MS);
    }

    private log_metrics() {
        if (this._monitors.length + 1 > MAX_WINDOW_SIZE) {
            this._monitors.shift();
        }
        const current = this.get_current();
        const avg = Avg(current.response_times || []) || 0;
        const std = Stg(current.response_times || []) || 0;
        // log metrics
        const new_monitor: Monitor = {
            ...current,
            response_times: [],
            timestamp: new Date(),
            successfull_requests: current.successfull_requests,
            // TODO request rates

            avg_response_time: avg,
            std_response_time: std,
        };
        if (this.is_different_from_latest(new_monitor)) {
            console.log("writing to database");
            console.log(new_monitor)
            DBHandler.instance.add_monitor(new_monitor);
        }
    }

    private is_different_from_latest(m: Monitor) {
        const current = this.get_current();
        // @ts-ignore
        let diff = within_range(current.message_rate, m.message_rate) +
            within_range(current.avg_response_time, m.avg_response_time) +
            within_range(current.std_response_time, m.std_response_time) +
            within_range(current.outgoing_requests_rate, m.outgoing_requests_rate) +
            within_range(current.database_write_rate, m.database_write_rate) +
            within_range(current.database_read_rate, m.database_read_rate);
        return diff > 2; // if any metric has significatly changed, ignore db changes
    }

    private get_current() {
        return this._monitors[this._monitors.length - 1];
    }

    public log_response_time(time: number) {
        this.get_current().response_times?.push(time);
    }

    public log_database(dr: number, dw: number) {
        this.get_current().database_reads += dr;
        this.get_current().database_writes += dw;
    }
    public log_requests(nr: number) {
        this.get_current().requests_total += nr;
    }
    public log_error(nr: number) {
        this.get_current().error_requests += nr;
    }
    public log_success(nr: number) {
        this.get_current().successfull_requests += nr;
    }
    public get values() {
        return this._monitors
    }
}
