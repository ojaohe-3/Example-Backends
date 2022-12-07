
import { Router } from "express";
import MonitorHandler from '../../handlers/MonitorHandler';

const app = Router();
const handler = MonitorHandler.instance;


app.get("/", (_, res) => {
	MonitorHandler.instance.monitor.successfull_requests += 1
	res.json(handler.monitor);
});

 
export default app;