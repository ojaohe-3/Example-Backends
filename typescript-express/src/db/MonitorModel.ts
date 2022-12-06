import IModel from "./model";
import { PoolClient } from "pg";
import Monitor from "../models/monitor";

// This is incase, some type transformation needs to be done
export type MonitorSchema = Monitor;

export default class MonitorModel implements IModel {
  private _client: PoolClient | undefined;

  public set client(value: PoolClient) {
    this._client = value;
  }

  public get table(): string {
    return "Monitor";
  }
  public async insertTable(item: MonitorSchema): Promise<number | null> {
    if (this._client !== null) {
      try {
        const text =
          "INSERT INTO Monitors( timestamp, \
                requests_total, \
                error_requests,\
                successfull_requests ,\
                message_rate , \
                avg_response_time , \
                std_response_time ,\
                outgoing_requests ,\
                outgoing_requests_rate ,\
                database_writes ,\
                database_reads ,\
                database_write_rate , \
                database_read_rate ) VALUES(CAST(EXTRACT(epoch FROM NOW()) AS BIGINT,\
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id";
        // cursor.read
        const { rows } = await this._client!.query(text, [
          item.requests_total,
          item.error_requests,
          item.successfull_requests,
          item.message_rate,
          item.avg_response_time,
          item.std_response_time,
          item.outgoing_requests,
          item.outgoing_requests_rate,
          item.database_writes,
          item.database_reads,
          item.database_write_rate,
          item.database_read_rate,
        ]);
        this._client?.release();

        return rows[0];
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      console.log("no connection object!");
      return null;
    }
  }

  public async getTables(): Promise<MonitorSchema[]> {
    if (this._client !== null) {
      try {
        const text = "SELECT * From Monitors";
        // cursor.read
        const {rows} = await this._client!.query(text);
        this._client?.release();

        return rows;
      } catch (error) {
        console.log(error);
        return [];
      }
    } else {
      console.log("no connection object!");
      return [];
    }
  }
  // This remains unimplemented
  public async getRow(uid: string): Promise<MonitorSchema[]> {
    console.log("cannot fetch single monitor object, not implemented!")
    return [];
  }
  
}
