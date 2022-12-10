import UserHandler from "../src/handlers/UserHandler";
import User from "../src/models/user";

describe("Test UserHandler", () => {
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

    describe("flush test", () => {
        beforeEach(() => {
            const handler = UserHandler.instance;
            //@ts-ignore
            handler._users = {}
        })

        test("flush when adding users enough users", () => {
            const nr_users = 10_000;
            const handler = UserHandler.instance;
            for (let i = 0; i < nr_users; i++) {
                handler.add_user({
                    id: i,
                    first_name: "test" + i,
                    last_name: "test" + i,
                    email: `test${i}@test.com`,
                    password: "123",
                    timestamp: Date.now()
                }, false)
            }
            expect(handler.length).toBe(nr_users);

            handler.add_user({
                id: nr_users + 1,
                first_name: "test" + nr_users + 1,
                last_name: "test" + nr_users + 1,
                email: `test${nr_users + 1}@test.com`,
                password: "123",
                timestamp: Date.now()
            }, false);
            expect(handler.length).toBe(5000)

        });


        test("flush outdated users", () => {
            const timeout_ms = 550_000;
            const handler = UserHandler.instance;
            expect(handler.length).toBe(0);

            for (let i = 1; i < 11; i++) {
                handler.add_user({
                    id: i,
                    first_name: "test" + i,
                    last_name: "test" + i,
                    email: `test${i}@test.com`,
                    password: "123",
                    timestamp: Date.now()
                }, false)
            }
            for (let i = 20; i < 30; i++) {
                handler.add_user({
                    id: i,
                    first_name: "test" + i,
                    last_name: "test" + i,
                    email: `test${i}@test.com`,
                    password: "123",
                    timestamp: Date.now() - timeout_ms
                }, false)
            }
            expect(handler.length).toBe(20);
            //@ts-ignore
            handler.flush();
            expect(handler.length).toBe(10);

        });
    });
    describe("database inteface test", () => {
        beforeEach(() => {
            const handler = UserHandler.instance;
            //@ts-ignore
            handler._users = {}
        })
        let delete_id = 0;
        test("insert works", async () => {
            const user: Partial<User> = {
                first_name: "test",
                last_name: "user",
                email: "user.test@test.com",
                password: "123",
            }
            const handler = UserHandler.instance;
            const error = await handler.add_user(user);
            expect(error).toBeNull();
            //@ts-ignore
            delete_id = Object.values(handler._users).filter(u => u.email === user.email)[0].id;  // for cleanup step
        });

        test("get all", async () => {
            const handler = UserHandler.instance;

            const users = await handler.get_all();
            expect(users.length).not.toBe(0);
            expect(handler.length).not.toBe(0);
        });

        test("get single", async () => {
            const handler = UserHandler.instance;

            const [user, error] = await handler.get_user(delete_id);
            expect(error).toBeNull();
            expect(user).not.toBeNull();
        })

        afterAll(() => {
            UserHandler.instance.delete_user(delete_id)
        })
    });
})