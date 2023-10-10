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