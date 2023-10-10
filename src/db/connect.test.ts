import { In } from "typeorm";
import { DatabaseConfig } from "../db-config";
import { TeacherStudentPersistenceService } from "../service";
import { Student } from "./student"
import { Teacher } from "./teacher";
import { DataBaseConnection } from "./connect";

// describe('MySQL Database connection ', () => {

//     beforeAll(async () => {
//         await DatabaseConfig.initialize();
//     });

//     test('Inserting and retrieving students', async() => {
        
//         console.log("Inserting a new student into the database...")
//         const student1 = new Teacher('foo@school.com')
//         const student2 = new Teacher('bar@school.com')

//         await DatabaseConfig.manager.save(student1)
//         console.log("Saved a new student with id: " + student1.email)
//         await DatabaseConfig.manager.save(student2)
//         console.log("Saved a new student with id: " + student2.email)


//         console.log("Loading students from the database...")
//         const students = await DatabaseConfig.manager.find(Teacher)
//         console.log("Loaded students: ", students)

//         expect(student1).toEqual(students.find((s) => s.email === student1.email));
//         expect(student2).toEqual(students.find((s) => s.email === student2.email));
//     });

//     afterAll(async () => {
//         await DatabaseConfig.destroy();
//     });
// });


describe('Persistence service - ', () => {
    const service = new TeacherStudentPersistenceService(new DataBaseConnection(DatabaseConfig));

    
    test('register', async() => {
        await service.dbConnection.initialize();
        // const student1 = new Student('hello@school.com', true)
        // const teacher = new Teacher('teacherC@school.com')
        // teacher.students = [student1]
        // await service.dbConnection.getRepository(Teacher).save(teacher);
        // const student2 = new Student('bar@school.com', false)
        // await DatabaseConfig.manager.save(student1)
        // await DatabaseConfig.manager.save(student2)
        console.log(JSON.stringify(await service.dbConnection.getRepository(Student).find({
            relations: {
                teachers: true,
            },
            where: { teachers: { email: In(['teacherA@school.com', 'teacherC@school.com']) }}
            // where:  [ 
            //     { teachers: { email: In(['teacherA@school.com', 'teacherC@school.com']) }},
            //     // { teachers: { email: 'teacherA@school.com' }},
            //     // { teachers: { email: 'teacherB@school.com' }},
            //     //{ teachers: { email: 'teacherC@school.com' }},
            // ]
        })));
        console.log(JSON.stringify(await service.dbConnection.getRepository(Student).find({
            relations: {
                teachers: true,
            }
        })));
        await service.dbConnection.destroy();

        // await service.register('teacherA@school.com', ['foo@school.com', 'bar@school.com']);
        // await service.dbConnection.initialize();
        // const teachers = await service.dbConnection.manager.find(Teacher);
        // console.log(teachers);
        // console.log(JSON.stringify(await service.dbConnection.getRepository(Student).find({
        //     relations: {
        //         teachers: true,
        //     }
        // })));
        // // await service.dbConnection.manager.remove(teachers)
        // // console.log(await service.dbConnection.manager.find(Teacher));
       
        // //await service.dbConnection.manager.remove(students)
        // console.log(await service.dbConnection.getRepository(Student).find({
        //     relations: {
        //         teachers: true,
        //     },
        // }));
        // await service.dbConnection.destroy();

        // await DatabaseConfig.initialize();
        // const teachers = await DatabaseConfig.manager.find(Teacher);
        // console.log(teachers);
        // const students = await DatabaseConfig.manager.find(Student);
        // console.log(students);
        // await DatabaseConfig.destroy();
        
    });

    // afterEach(async () => {
    //     // Fetch all the entities
    //     await service.dbConnection.initialize();
    //     //const entities = service.dbConnection.entityMetadatas;
    
    //     // for (const entity of entities) {
    //     //     const repository = service.dbConnection.getRepository(entity.name); // Get repository
    //     //     await repository.clear(); // Clear each entity table's content
    //     // }

    //     // await service.dbConnection.createQueryBuilder()..delete().
    //     //     .truncate("teacher_students_student")
    //     //     .execute();
    //     await service.dbConnection.query(`TRUNCATE TABLE teacher_students_student RESTART IDENTITY CASCADE;`);
    //     await service.dbConnection.getRepository(Student).clear();
    //     await service.dbConnection.getRepository(Teacher).clear();
    //     await service.dbConnection.destroy();
    // });
});


