
import { Router } from "express";
import UserHandler from '../../handlers/UserHandler';
import User, { Email } from "../../models/user";
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
		if (user) {
			const temp: Partial<User> = { ...user };
			delete temp.admin
			delete temp.password;
			delete temp.timestamp;
			MonitorHandler.instance.monitor.successfull_requests += 1;
			res.json({
				success: true,
				body: temp
			});
		} else {
			MonitorHandler.instance.monitor.error_requests += 1;

			res.status(500).json({
				success: false,
				details: error?.detail,
				message: error?.message,
				name: error?.name,
			})
		}

	} catch (error) {
		MonitorHandler.instance.monitor.error_requests += 1;

		res.status(500).json({
			success: false,
			error: error
		})
	}
});

app.post("/", async (req, res) => {
	try {
		const data = req.body as userFormat;
		data.password = crypto.createHash('sha256').update(data.password!).digest('hex')

		
		const error = await handler.add_user(data);

		if (error === null) {
			MonitorHandler.instance.monitor.successfull_requests += 1;

			res.json({
				success: true,
				message: `user ${data.first_name} ${data.last_name} added successfully`
			})
		} else {
			MonitorHandler.instance.monitor.error_requests += 1;

			res.status(500).json({
				success: false,
				details: error?.detail,
				message: error?.message,
				name: error?.name,
			})
		}
	} catch (error) {
		MonitorHandler.instance.monitor.error_requests += 1;
		console.log(error)
		res.status(400).json({
			success: false,
			error: error
		})
	}
});

app.delete("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const [_res, error] = await handler.delete_user(+id);
		if (error) {
			MonitorHandler.instance.monitor.error_requests += 1;

			res.status(500).json({
				success: false,
				details: error?.detail,
				message: error?.message,
				name: error?.name,
			})
		} else {
			MonitorHandler.instance.monitor.successfull_requests += 1;

			res.json({
				success: true,
				message: "user deleted successfully"
			})
		}

	} catch (error) {
		MonitorHandler.instance.monitor.error_requests += 1;

		console.log(error)
		res.status(500).json({
			success: false,
			error: error
		})
	}
})

export default app;