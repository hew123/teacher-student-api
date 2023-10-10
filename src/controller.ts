import { ErrorRespWithCode, GetCommonStudentsRequest, GetCommonStudentsResponse, NotifyRequest, NotifyResponse, RegisterRequest, SuspendRequest } from "./model/dto";
import { Email, NotificationText } from "./model/email";
import { RequestError } from "./model/error";
import { RegistrationService } from "./service";

export class RegistrationController {
    constructor(
        readonly service: RegistrationService
    ) {}

    async register(input: RegisterRequest): Promise<void | ErrorRespWithCode> {
        try {
            const teacherEmail = new Email(input.teacher);
            const studentEmails = input.students.map((s) => new Email(s));
            await this.service.register(teacherEmail, studentEmails);
        }
        catch (err) {
            const errMsg = `Error registering teacher ${input.teacher} with students ${JSON.stringify(input.students)}: ${err}`
            console.log(errMsg);
            return err instanceof RequestError ? 
                { message: errMsg, statusCode: 400 }: 
                { message: errMsg, statusCode: 500 };
        }
    }

    async suspend(input: SuspendRequest): Promise<void | ErrorRespWithCode> {
        try {
            const email = new Email(input.student);
            await this.service.suspend(email);
        }
        catch(err) {
            const errMsg = `Error suspending student ${input.student}: ${err}`
            console.log(errMsg);
            return err instanceof RequestError ? 
                { message: errMsg, statusCode: 400 }: 
                { message: errMsg, statusCode: 500 };
        }
    }

    async notify(input: NotifyRequest): Promise<NotifyResponse | ErrorRespWithCode> {
        try {
            const teacherEmail = new Email(input.teacher);
            const students = await this.service.getNonSuspendedStudents(teacherEmail);
            const notificationText = new NotificationText(input.notification);
            const notifyEmails = notificationText.emails.map((e) => e.text);
            const notifyEmailSet = new Set(notifyEmails);
            const recipients = students.map((s) => s.email).filter((e) => !notifyEmailSet.has(e));
            return { recipients: [...notifyEmails, ...recipients] };
        }
        catch(err) {
            const errMsg = `Error notifying from teacher ${input.teacher} with notification ${input.notification}: ${err}`
            console.log(errMsg);
            return err instanceof RequestError ? 
                { message: errMsg, statusCode: 400 }: 
                { message: errMsg, statusCode: 500 };
        }
    }

    async getCommonStudents(input: GetCommonStudentsRequest): Promise<GetCommonStudentsResponse | ErrorRespWithCode> {
        try {
            const teachers = Array.isArray(input) ? input: [input];
            const emails = teachers.map((t) => new Email(t));
            const students = await this.service.getCommonStudents(emails);
            return { students: students.map((s) => s.email) };
        }
        catch(err) {
            const errMsg = `Error getting common students with teachers ${input.teacher} : ${err}`
            console.log(errMsg);
            return err instanceof RequestError ? 
                { message: errMsg, statusCode: 400 }: 
                { message: errMsg, statusCode: 500 };
        }
    }

    
}