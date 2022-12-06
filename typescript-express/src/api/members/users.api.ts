
import { Router } from "express";
import UserHandler from '../../handlers/UserHandler';

const app = Router();
const handler = UserHandler.instance;

interface userFormat{

}

app.get("/", (_, res) => {
	res.json(handler.get_all());
});

app.get("/:id", (req, res) => {
	try {
		const id = req.params.id;

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