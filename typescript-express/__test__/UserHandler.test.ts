import UserHandler from "../src/handlers/UserHandler";

describe("Test UserHandler", () =>{
    describe("Singelton pattern test", () => {
        test("instance is not null", () => {
            let handler = UserHandler.instance;
            expect(handler).not.toBeNull();
        });
        test("instance contains same object ref", () => {
            let handler1 = UserHandler.instance;
            let handler2 = UserHandler.instance;
            expect(handler1).toBe(handler2);
        });
        test("instance returns correct type", () => {
            expect(UserHandler.instance).toBeInstanceOf(UserHandler)
        });
    });

    describe("flush test", ()=>{
        test("flush when adding users")
    })
})