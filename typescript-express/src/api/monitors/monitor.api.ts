
import { Router } from "express";
import MonitorHandler from '../../handlers/MonitorHandler';

const app = Router();
const handler = MonitorHandler.instance;


app.get("/", (_, res) => {
	res.json(handler.values);
});

 
export default app;