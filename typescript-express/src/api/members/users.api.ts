
import { Router } from "express";
import UserHandler from '../../handlers/UserHandler';
import User from "../../models/user";
import MonitorHandler from '../../handlers/MonitorHandler';
import crypto from 'crypto';
const app = Router();
const handler = UserHandler.instance;
type userFormat = Partial<User>

app.get("/", (_, res) => {
	const all = handler.get_all();
	MonitorHandler.instance.log_success(1)
	res.json(all);
});

app.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const user = await handler.get_user(+id);
		const temp = {...user};
		delete temp.admin
		delete temp.password;
		delete temp.timestamp;
		res.json(temp);
	} catch (error) {
		res.json({error: error})
	}
});

app.post("/", (req, res) => {
	try {
		
		const data = req.body as userFormat;
		data.password =  crypto.createHash('sha256').update(data.password!).digest('hex')
		handler.add_user(data)
		res.json({
			sucess: true,

		})
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