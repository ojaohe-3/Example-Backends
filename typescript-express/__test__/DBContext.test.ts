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

    describe("querry object for user exists", () => {
        test("User querry object", async () => {
            const querry = await DBContext.instance.user;
            expect(querry).not.toBeNull();
        });
    });

    
})