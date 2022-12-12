export default interface Monitor {

  timestamp: number;
  requests: number;
  requests_total:number;
  error_requests: number;
  successfull_requests: number;
  message_rate: number;
  avg_response_time: number;
  std_response_time: number;
  outgoing_requests: number;
  outgoing_requests_total: number;
  outgoing_requests_rate: number;
  database_writes: number;
  database_reads: number;
  database_operations_total: number;
  database_write_rate: number; 
  database_read_rate: number; 
  response_times: number[];
}
