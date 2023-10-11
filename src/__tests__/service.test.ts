import { DatabaseConfig } from "../db-config";
import { RegistrationService } from "../service";
import { DataBaseConnection } from "../db/connect";
import { Email } from "../model/email";


describe('Persistence service - ', () => {
    const service = new RegistrationService(new DataBaseConnection(DatabaseConfig));
    const teacher1Email = 'hello@teacher.com';
    const student1Email = 'foo@student.com';
    const student2Email = 'bar@student.com';

    beforeAll(async() => {
        await service.dbConnection.connectToDb();
    })

    // To check if tables are empty, for debugging purpose
    beforeEach(async() => {
        console.log('Initial Teacher table: ', JSON.stringify(await service.getAllTeachers()));
        console.log('Initial Student table: ', JSON.stringify(await service.getAllStudents()));
    })
    
    test('register', async() => {
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

    afterEach(async () => {
        // tear down
        const students = await service.getAllStudents();
        await service.studentRepository.remove(students);
        const teachers = await service.getAllTeachers();
        await service.teacherRepository.remove(teachers);
    });

    afterAll(async( ) => {
        await service.dbConnection.closeConnection();
    })
});


