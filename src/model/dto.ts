export type SuccessResponse = {
    success: boolean
}

export type RegisterRequest = {
    teacher: string;
    students: string[];
}

export type RegisterResponse = SuccessResponse;

export type SuspendRequest = {
    student: string;
}

export type SuspendResponse = SuccessResponse;

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
    return res === undefined ? 
            res === null ? false: 
            false:  'message' in res && 'statusCode' in res;
}