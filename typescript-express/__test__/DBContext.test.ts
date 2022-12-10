import DBContext from "../src/db/DBContext";
import UserQuerryObject from "../src/db/UserQuerryObject";
import User from "../src/models/user";

describe("DBcontext test", () => {


    describe("Singelton pattern test", () => {
        test("instance is not null", () => {
            let handler = DBContext.instance;
            expect(handler).not.toBeNull();
        });
        test("instance contains same object ref", () => {
            let handler1 = DBContext.instance;
            let handler2 = DBContext.instance;
            expect(handler1).toBe(handler2);
        });
        test("instance returns correct type", () => {
            expect(DBContext.instance).toBeInstanceOf(DBContext)
        })

    });

    describe("querry object has client", () => {
        test("User querry object", async () => {
            const querry = await DBContext.instance.user();
            expect(querry).not.toBeNull();
            expect(querry!.client).not.toBeNull();
        });
    });

    describe("transaction work for all types", () => {
        const handler = DBContext.instance;
        let querry: UserQuerryObject | null = null;
        const insert: Partial<User> = {
            first_name: "test",
            last_name: "user",
            email: "test.user@test.com",
            password: "test"
        };


        beforeEach(async () => {
            querry = await handler.user();
            const [id, error] = await querry!.insertRow<number>(insert)

            expect(error).toBeNull();
            expect(id).not.toBeNull();
            insert.id = id!;
            const delay = (ms: number) => new Promise( resolve => setTimeout(resolve, ms) )
            await delay(500) // wait 500 ms

        })
        afterEach(async () => {
            querry = await handler.user();
            const [res, error] = await querry!.deleteRow(insert.id!);
            expect(error).toBeNull();
            expect(res).not.toBeNull();
            // get a new connector from the pool
            querry = await handler.user();

        })


        test("Transaction work for getrows", async () => {
            const [items, error] = await handler.Transaction(querry!, "getRows");
            expect(error).toBeNull();
            expect(items).not.toBeNull();
            expect(items.length).toBeGreaterThan(0);
            expect(items).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ email: insert.email })
                ]));


        });

        test("Transaction work for getrow", async () => {
            const [item, error] = await handler.Transaction(querry!, "getRow", insert.id!);
            expect(error).toBeNull();
            expect(item).not.toBeNull();
            expect(item).toEqual(expect.objectContaining({ email: insert.email }));
        });

        test("Transaction work for insertRow", async () => {
            const user: Partial<User> = {
                first_name: "test2",
                last_name: "user2",
                email: "test.user.2@test.com",
                password: "test"
            };
            const [id, error] = await handler.Transaction(querry!, "insertRow", user);
            expect(error).toBeNull();
            expect(id).not.toBeNull();

            querry = await handler.user();
            let [u, error2] = await querry!.getRow(id);
            expect(error2).toBeNull();
            expect(u).not.toBeNull();
            expect(u).toEqual(expect.objectContaining({ email: user.email }))

        });

        test("Transaction work for deleteRow", async () => {
            const [res, error] = await handler.Transaction(querry!, "deleteRow");
            expect(error).toBeNull();
            expect(res).not.toBeNull();

            querry = await handler.user();
            let [u, error2] = await querry!.getRow(insert.id!);
            expect(error2).not.toBeNull();
            expect(u).toBeNull();

        });

        test("Trasnaction throws 'invalid key' for any other case", async () =>{
            expect(await handler.Transaction(querry!, "client")).toThrowError();
        });
    });
})