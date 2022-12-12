import { PoolClient } from "pg";
import DBContext from "../src/db/DBContext";
import UserQuerryObject from "../src/db/UserQuerryObject";
import User from "../src/models/user";

describe("Database operations work for all types", () => {
    const handler = DBContext.instance;
    const querry = handler.user;
    const insert: Partial<User> = {
        first_name: "test",
        last_name: "user",
        email: "test.user@test.com",
        password: "test"
    };

    test("getting a connection client", () =>{
        //@ts-ignore
        const client: PoolClient= await querry.connect();
        expect(client).not.toBeNull();
    })



    test("insert works", async () => {

        const [id, err1] = await querry!.insertRow(insert);
        expect(err1).toBeNull();
        expect(id).not.toBeNull();
        insert.id = id! as number; 

    });

    test("getrows work", async () => {
        const [items, error] = await querry!.getRows();
        expect(error).toBeNull();
        expect(items).not.toBeNull();
        expect(items!.length).toBeGreaterThan(0);
        expect(items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ email: insert.email })
            ]));



    });

    test("getrow works", async () => {
        const [item, error] = await querry!.getRow(insert.id!);
        expect(error).toBeNull();
        expect(item).not.toBeNull();
        expect(item).toEqual(expect.objectContaining({ email: insert.email }));
    });


    test("deleteRow works", async () => {

        const [res, error] = await querry!.deleteRow(insert.id!);
        expect(error).toBeNull();
        expect(res).not.toBeNull();

    });

    // test("Trasnaction throws 'invalid key' for any other case", async () =>{
    //     expect(await handler.Transaction(querry!, "client")).toBeUndefined();
    // });
});