export interface GeneralError{
    exception: string,
    reason: string,
    code: number
}

export interface DatabaseError{

}

export interface GeneralAPIError{
    error?: GeneralError,
    database_error?: DatabaseError,
}

export interface APIUserErrors extends GeneralAPIError{

}

export interface APIMonitorErrors extends GeneralAPIError{
    
}



export default function ErrorParser(error: any): GeneralAPIError | null{
    return null
}
