import { DatabaseConfig } from "./config";
import { Student } from "./student"

describe('MySQL Database connection ', () => {

    beforeAll(async () => {
        await DatabaseConfig.initialize();
    });

    test('Inserting and retrieving students', async() => {
        
        console.log("Inserting a new student into the database...")
        const student1 = new Student('foo@school.com')
        const student2 = new Student('bar@school.com')

        await DatabaseConfig.manager.save(student1)
        console.log("Saved a new student with id: " + student1.email)
        await DatabaseConfig.manager.save(student2)
        console.log("Saved a new student with id: " + student2.email)


        console.log("Loading students from the database...")
        const students = await DatabaseConfig.manager.find(Student)
        console.log("Loaded students: ", students)

        expect(student1).toEqual(students.find((s) => s.email === student1.email));
        expect(student2).toEqual(students.find((s) => s.email === student2.email));
    });

    afterAll(async () => {
        await DatabaseConfig.destroy();
    });
});