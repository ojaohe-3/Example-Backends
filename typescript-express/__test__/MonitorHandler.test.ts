import MonitorHandler from "../src/handlers/MonitorHandler"

describe("Test monitor", () =>{
    let handler = MonitorHandler.instance;

    beforeEach(() => {
        handler.monitor.response_times = [1.5, 2.5, 3.5]
        handler.monitor.database_reads = 5;
        handler.monitor.database_writes = 5;
        handler.monitor.outgoing_requests = 5;
        handler.monitor.requests = 5;
        //@ts-ignore
        handler.log_metrics();

    })
    test("response time works as intended", () =>{

        let avg_resp = handler.monitor.avg_response_time;
        let std_resp = handler.monitor.std_response_time;
        let r = handler.monitor.response_times;
        
        expect(avg_resp).not.toBe(0);
        expect(std_resp).not.toBe(0);
        expect(r.length).toBe(0);
    });

    test("rate is calculated", () =>{
        let mr = handler.monitor.message_rate;
        let dr = handler.monitor.database_read_rate;
        let dw = handler.monitor.database_write_rate;
        let or = handler.monitor.outgoing_requests_rate;
        
        expect(mr).not.toBeCloseTo(0);
        expect(dr).not.toBeCloseTo(0);
        expect(dw).not.toBeCloseTo(0);
        expect(or).not.toBeCloseTo(0);

        let dot = handler.monitor.database_operations_total;      
        let rt = handler.monitor.requests_total;
        let ot = handler.monitor.outgoing_requests_total;
        
        expect(dot).not.toBe(0);
        expect(rt).not.toBe(0);
        expect(ot).not.toBe(0);

        let r = handler.monitor.requests;
        let o = handler.monitor.outgoing_requests;
        let dro = handler.monitor.database_reads;
        let dwo = handler.monitor.database_writes;

        expect(r).toBe(0);
        expect(o).toBe(0);
        expect(dro).toBe(0);
        expect(dwo).toBe(0);
    });

})