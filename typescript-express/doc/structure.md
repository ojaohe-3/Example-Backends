[]()


# DBContext
    Singelton pattern that maintains all querry objects life time.
    Will at the moment create only a ``` UserQuerryObject ``` and exposes it to others

## Functions
#### instance
```ts
    public static get instance()
```
gets singelton instance, creates a new object if it does not exist
#### user
```ts
    public get user();
```
get instance user querry object
# QuerryObject
Interface that all table querry types should hold, Future this would be an abstract class, as to not repete code. and just have inherited values describe what values operation should insert

```ts
type DBResult<T> = [T | null, DatabaseError | null]
type DBResults<T> = [T[] | null , DatabaseError | null]
interface QuerryObject<T> {
  insertRow: <K>(item: any) => Promise<DBResult<K>>;
  getRows: (...querry_items: any[]) => Promise<DBResults<T>>;
  getRow: (...querry_items: any[]) => Promise<DBResult<T>>;
  deleteRow: (item: any) => Promise<DBResult<any>>;
}
```
The function names should derscribe what the purpose of that operation.

```ts
type DBResult<T> = [T | null, DatabaseError | null]
type DBResults<T> = [T[] | null , DatabaseError | null]
```
Typescript typings that can be used to propagate error or value to the api endpoint. 
# UserQueerryObject
Implements QuerryObject
takes a pg pool object as constructor argument
will manage its own connection pool to the database. 
# UserHandler

Singelton instance that Handles the cache of user tables available on the backend.

Known issue is that user map does not always delete when instructed.

all users are mapped to a Js-object, and have Naïvley implemented flush operations. that runs when cache amount is violated
## Functions

#### instance
Gets singelton instance, creates object if null
#### add_user
take a primitive User object, inserts it into the cache map, as well attempts to insert it into the database. Will return error if it fails. It will not cache failed results
#### get_all
queries the database and adds all results to cache, will flush the cach straight after. Currently does not clean Ghost cached items.
#### get_user
Gets a user from the cache map, if it finds it in the cache return that at once, otherwise querries the database.
#### delete_user
Deletes user from cache then deletes item in database
# MonitorHandler
Monitor handler that is supplied with metrics whenever an operation that is of intresst occurs, helps when debugging implementations that might have constraints on it.
## Functions
#### instance
Gets singelton instance, creates object if null
#### log_metrics
private function that runs every minute or what is configured.
Log metrics calculate previous runs rates and logs other usefull metrics such as mean and std
# Models
Have the backends reperesentation of the table values
contains currently only monitor and user.
```ts
interface Monitor {

  timestamp: number;
  requests: number;
  requests_total:number;
  error_requests: number;
  successfull_requests: number;
  message_rate: number;
  avg_response_time: number;
  std_response_time: number;
  outgoing_requests: number;
  outgoing_requests_total: number;
  outgoing_requests_rate: number;
  database_writes: number;
  database_reads: number;
  database_operations_total: number;
  database_write_rate: number; 
  database_read_rate: number; 
  response_times: number[];
}

```
```ts
interface User {
  id: number; 
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  updated_at?: Date;
  last_login?: Date;
  created_at: Date;
  admin: boolean;
  timestamp?: number;
}
```
note that user model contains a Email type, which just help developers, TS does not attempt to make raw strings compliant.
# Utils
Math utilities
## Functions

#### within_range
if a float is whinin a range of 0.01
#### Sum
calculates sum of array
#### Avg
calculates average of array
#### Std
calculates standard diviation
# app
creates api, aswell as creates headers, middle ware that calcuates metrics and logs, aswells at setting the cors policy.

# index
creates the server.