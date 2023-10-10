import { RequestError } from "./error";

// 'g' at the back means global search - it is stateful in keeping track of where it leaves off 
// previously while reading the text - used to extracting multiple email addresses from text
// BUT should not be used for normal email regex testing because it is stateful
const EXTRACT_EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
// Having another regex without 'g' at the back to validate email address
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;


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
        const emailStrs = notifyText.match(EXTRACT_EMAIL_REGEX);
        this.emails = emailStrs?.map((e) => new Email(e)) ?? [];
    }
}