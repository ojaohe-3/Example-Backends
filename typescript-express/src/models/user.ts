export default interface User{
    uid: string, // Uniqe
    first_name: string,
    last_name: string,
    email: string, // Uniqe
    password: string,
    updated_at? : Date,
    last_login? : Date,
    created_at : Date,
    admin: boolean,
    timestamp?: number
}