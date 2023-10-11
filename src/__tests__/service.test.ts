import { DatabaseConfig } from "../db-config";
import { RegistrationService } from "../service";
import { DataBaseConnection } from "../db/connect";
import { Email } from "../model/email";


describe('Persistence service - ', () => {
    const service = new RegistrationService(new DataBaseConnection(DatabaseConfig));
    const teacher1Email = 'hello@teacher.com';
    const teacher2Email = 'world@teacher.com';
    const student1Email = 'foo@student.com';
    const student2Email = 'bar@student.com';
    const student3Email = 'easy@student.com';

    beforeAll(async() => {
        await service.dbConnection.connectToDb();
        // To check if tables are empty, for debugging purpose
        console.log('Initial Teacher table: ', JSON.stringify(await service.getAllTeachers()));
        console.log('Initial Student table: ', JSON.stringify(await service.getAllStudents()));
    })
    
    test('register should create 1 teacher registered with 2 students', async() => {
        await service.register(
            new Email(teacher1Email), 
            [new Email(student1Email), new Email(student2Email)]
        );
        const teacher = (await service.getAllTeachers()).find((t) => t.email === teacher1Email);
        const students = (await service.getAllStudents()).filter((s) => s.email == student1Email || s.email == student2Email);
        expect(teacher?.students.map((s) => s.email)).toEqual([student2Email, student1Email]);
        expect(students[0].teachers.map((t) => t.email)).toEqual([teacher1Email]);
        expect(students[1].teachers.map((t) => t.email)).toEqual([teacher1Email]);
    });

    test('getUnsuspendedStudents should return 2 students subscribed to Teacher1', async() => {
        const students = await service.getUnsuspendedStudents(new Email(teacher1Email));
        expect(students.map((s) => s.email)).toEqual([student2Email, student1Email]);
    })

    test('suspend should change suspended flag to true', async() => {
        await service.suspend(new Email(student1Email));
        const students = (await service.getAllStudents()).filter((s) => s.email == student1Email);
        expect(students[0].suspended).toEqual(true);

    });

    test('getUnsuspendedStudents should return only unsuspended students', async() => {
        const students = await service.getUnsuspendedStudents(new Email(teacher1Email));
        expect(students.map((s) => s.email)).toEqual([student2Email]);
    })

    test('register should append registration list and not overwrite any existing student attributes e.g. suspended flag', async() => {
        await service.register(
            new Email(teacher1Email), 
            [new Email(student3Email)]
        );
        const teacher = (await service.getAllTeachers()).find((t) => t.email === teacher1Email);
        const students = (await service.getAllStudents()).filter((s) => s.email == student1Email || s.email == student2Email || s.email == student3Email);
        expect(teacher?.students.map((s) => s.email)).toEqual([student2Email, student3Email, student1Email]);
        expect(students[0].teachers.map((t) => t.email)).toEqual([teacher1Email]);
        expect(students[1].teachers.map((t) => t.email)).toEqual([teacher1Email]);
        expect(students[2].teachers.map((t) => t.email)).toEqual([teacher1Email]);
        expect(students.find((s) => s.email == student1Email)?.suspended).toEqual(true);
    });

    test('getCommonStudents only return 2 students common students registered to the teachers out of 3 students', async() => {
        await service.register(
            new Email(teacher2Email), 
            [new Email(student1Email), new Email(student3Email)]
        );
        const students = await service.getCommonStudents([new Email(teacher1Email), new Email(teacher2Email)]);
        expect(students.map(s => s.email)).toEqual([student3Email, student1Email]);
    });

    afterAll(async( ) => {
        // tear down
        const students = await service.getAllStudents();
        await service.studentRepository.remove(students);
        const teachers = await service.getAllTeachers();
        await service.teacherRepository.remove(teachers);
        await service.dbConnection.closeConnection();
    })
});


