export interface ServerException {
    error: ServerExceptionType;
    message: string;
}

export enum ServerExceptionType {
    INPUT_ERROR = "INPUT_ERROR",
    SERVER_ERROR = "SERVER_ERROR"
}

export function serverException(error: ServerExceptionType, message: string): ServerException {
    return {
        error,
        message
    }
}