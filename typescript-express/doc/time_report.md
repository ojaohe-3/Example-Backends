## Time Reports

| day  | start  | end  | total  | report item | commit |
|---|---|---|---|---|---|
| 1  | 14:00  |  18:00 | 4  | 1  | 7864285d81ded85353062a788db52182a649669d |
| 1  | 19:00  |  22:00 | 3  | 2 | 247a42698b0a05b40e5ad4eccc9029279cacf141 |
| 2  | 19:00 | 21:00  | 2 | 3  | 873d9aaf98a2c11c0ff43a00a701da15dcfb93ca |
| 5  | 16:00 | 20:00 | 4 | 4 | e20eaafb496a5e7cfa2a27f5bbf88f29e37c21ff|
| 5  | 20:00 | 24:00 | 4 | 5 | 849efa02352edfcffb9c6584acf79b88f5cc343b|



## Report item

1. Added the basic framework for ts, planned database handler, user handler and monitor handler. planning to use JWT for authentication.
1. Added DB and most of its functionality, made a dbcontext, the main thought to seperate context and handler is for testing. Models changed a bit, added the sql tables. made monitor logic.
1. fixed issues with connecting to database. and error can propagate to api
1. large refactor of dbhandler and tests on the database
1. Finished tests ts-backend is complete-ish
