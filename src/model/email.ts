import { RequestError } from "./error";

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// TODO: add test
export class Email {
    constructor(readonly text: string) {
        if (EMAIL_REGEX.test(text) == false) {
            throw new RequestError(`Invalid email address: ${text}`);
        }
    }
}

// TODO: add test
export class NotificationText {
    emails: Email[]
    constructor(readonly notifyText: string) {
        const emailStrs = notifyText.match(EMAIL_REGEX);
        this.emails = emailStrs?.map((e) => new Email(e)) ?? [];
    }
}