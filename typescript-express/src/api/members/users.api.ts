
import { Router } from "express";
import UserHandler from '../../handlers/UserHandler';
import User from "../../models/user";
import MonitorHandler from '../../handlers/MonitorHandler';
import crypto from 'crypto';
const app = Router();
const handler = UserHandler.instance;
type userFormat = Partial<User>

app.get("/", async (_, res) => {
	const all = await handler.get_all();

	MonitorHandler.instance.monitor.successfull_requests += 1
	res.json(all);
});

app.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const [user, error] = await handler.get_user(+id);
		if(user){
			console.log(user)
			const temp: Partial<User>= {...user};
			delete temp.admin
			delete temp.password;
			delete temp.timestamp;
			MonitorHandler.instance.monitor.successfull_requests += 1
			res.json(temp);
		}else{
			res.status(500).json({
				sucess: false,
				details: error?.detail,
				message: error?.message,
				name: error?.name,
			})
		}

	} catch (error) {
		res.json({error: error})
	}
});

app.post("/", async (req, res) => {
	try {
		
		const data = req.body as userFormat;
		data.password =  crypto.createHash('sha256').update(data.password!).digest('hex')
		const error = await handler.add_user(data);
		if(error === null){
			res.json({
				sucess: true,
	
			})
		}else{
			res.status(500).json({
				sucess: false,
				details: error?.detail,
				message: error?.message,
				name: error?.name,
			})
		}
	} catch (error) {
		res.status(500).json({
			sucess: false,
			error: error})
	}
});

app.delete("/:id", (req, res)=>{
    try {
		const id = req.params.id;

	} catch (error) {

	}
})
 
export default app;