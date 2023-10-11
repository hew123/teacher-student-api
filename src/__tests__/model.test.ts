import { Email, NotificationText } from "../model/email";


describe('Email validation - ', () => {
    const email1 = 'foo@student.com';
    const email3 = 'foo@bar';

    test('not throw error if email address is valid', async() => {
        expect(() => new Email(email1)).not.toThrowError();
    });

    test('throw error if email address is invalid', async() => {
        expect(() => new Email(email3)).toThrowError();
    });
});


describe('Notification Text - ', () => {
    const email1 = 'foo@student.com';
    const email2 = 'bar@student.com';
    const email3 = 'foo@bar';

    test('should extract 2 emails in the notification text', async() => {
        const text = `Hello ${email1} ${email2}`;
        expect(new NotificationText(text).emails).toEqual([new Email(email1), new Email(email2)])
    });

    test('should extract only 1 valid email in the notification text', async() => {
        const text = `Hello ${email1} ${email3}`;
        expect(new NotificationText(text).emails).toEqual([new Email(email1)]);
    });
});
