import { ErrorResponse, GetCommonStudentsRequest, GetCommonStudentsResponse, NotifyRequest, NotifyResponse, RegisterRequest, SuspendRequest } from "./model/dto";
import { Email } from "./model/email";
import { RegistrationService } from "./service";

export class RegistrationController {
    constructor(
        readonly service: RegistrationService
    ) {}

    async register(input: RegisterRequest): Promise<void | ErrorResponse> {
        try {
            const teacherEmail = new Email(input.teacher);
            const studentEmails = input.students.map((s) => new Email(s));
            await this.service.register(teacherEmail, studentEmails);
        }
        catch (err) {
            const errMsg = `Error registering teacher ${input.teacher} with students ${JSON.stringify(input.students)}: ${err}`
            console.log(errMsg);
            return { message: errMsg };
        }
    }

    async suspend(input: SuspendRequest): Promise<void | ErrorResponse> {
        try {
            const email = new Email(input.student);
            await this.service.suspend(email);
        }
        catch(err) {
            const errMsg = `Error suspending student ${input.student}: ${err}`
            console.log(errMsg);
            return { message: errMsg };
        }
    }

    async notify(input: NotifyRequest): Promise<NotifyResponse | ErrorResponse> {
        try {
            const teacherEmail = new Email(input.teacher);
            const students = await this.service.getNonSuspendedStudents(teacherEmail);
            // TODO: Add emails from input
            const recipients = students.map((s) => s.email);
            return { recipients: recipients };
        }
        catch(err) {
            const errMsg = `Error notifying from teacher ${input.teacher} with notification ${input.notification}: ${err}`
            console.log(errMsg);
            return { message: errMsg };
        }
    }

    async getCommonStudents(input: GetCommonStudentsRequest): Promise<GetCommonStudentsResponse | ErrorResponse> {
        try {
            const teachers = Array.isArray(input) ? input: [input];
            const emails = teachers.map((t) => new Email(t));
            const students = await this.service.getCommonStudents(emails);
            return { students: students.map((s) => s.email) };
        }
        catch(err) {
            const errMsg = `Error getting common students with teachers ${input.teacher} : ${err}`
            console.log(errMsg);
            return { message: errMsg };
        }
    }

    
}