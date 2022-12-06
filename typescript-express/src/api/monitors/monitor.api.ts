
import { Router } from "express";
import MonitorHandler from '../../handlers/MonitorHandler';

const app = Router();
const handler = MonitorHandler.instance;


app.get("/", (_, res) => {
	res.json({"error": "not implemented yet"});
});

 
export default app;