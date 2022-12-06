
import { Router } from "express";
import UserHandler from '../../handlers/UserHandler';
import User from "../../models/user";

const app = Router();
const handler = UserHandler.instance;

type userFormat = Partial<User>

app.get("/", (_, res) => {
	res.json(handler.get_all());
});

app.get("/:id", (req, res) => {
	try {
		const id = req.params.id;
		handler.get_user(+id);

	} catch (error) {

	}
});

app.post("/", (req, res) => {
	try {
		const data = req.body as userFormat;
	} catch (error) {
		
	}
});

app.delete("/:id", (req, res)=>{
    try {
		const id = req.params.id;

	} catch (error) {

	}
})
 
export default app;