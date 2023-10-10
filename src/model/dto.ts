export type RegisterRequest = {
    teacher: string;
    students: string[];
}

export type SuspendRequest = {
    student: string;
}

export type GetCommonStudentsRequest = {
    teacher: string[] | string;
}

export type GetCommonStudentsResponse = {
    students: string[];
}

export type NotifyRequest = {
    teacher: string;
    notification: string;
}

export type NotifyResponse = {
    recipients: string[];
}

export type ErrorResponse = {
    message: string;
}

export type ErrorRespWithCode = ErrorResponse & { statusCode: number };

export function isErrRespWithCode(res: any | ErrorRespWithCode): res is ErrorRespWithCode {
    return (res as ErrorRespWithCode).message !== undefined
        && (res as ErrorRespWithCode).statusCode !== undefined;
}