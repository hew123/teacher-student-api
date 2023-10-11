import { In } from "typeorm";
import { DatabaseConfig } from "../db-config";
import { RegistrationService } from "../service";
import { Student, Teacher } from "../db"
import { DataBaseConnection } from "../db/connect";

describe('Persistence service - ', () => {
    const service = new RegistrationService(new DataBaseConnection(DatabaseConfig));

    beforeAll(async() => {
        await service.dbConnection.connectToDb();
    })

    // To check if tables are empty, for debugging purpose
    beforeEach(async() => {
        const students = await service.studentRepository.find({
            relations: {
                teachers: true,
            }
        });
        const teachers = await service.teacherRepository.find({
            relations: {
                students: true,
            }
        })
        console.log('Initial Teacher table: ', JSON.stringify(teachers));
        console.log('Initial Student table: ', JSON.stringify(students));
    })
    
    test('register', async() => {
        // const student1 = new Student('hello@school.com', true)
        // const teacher = new Teacher('teacherC@school.com')
        // teacher.students = [student1]
        // await service.dbConnection.getRepository(Teacher).save(teacher);
        // const student2 = new Student('bar@school.com', false)
        // await DatabaseConfig.manager.save(student1)
        // await DatabaseConfig.manager.save(student2)
        // console.log(JSON.stringify(await service.dbConnection.getRepository(Student).find({
        //     relations: {
        //         teachers: true,
        //     },
        //     where: { teachers: { email: In(['teacherA@school.com', 'teacherC@school.com']) }}
            // where:  [ 
            //     { teachers: { email: In(['teacherA@school.com', 'teacherC@school.com']) }},
            //     // { teachers: { email: 'teacherA@school.com' }},
            //     // { teachers: { email: 'teacherB@school.com' }},
            //     //{ teachers: { email: 'teacherC@school.com' }},
            // ]
        // })));
        // console.log(JSON.stringify(await service.dbConnection.getRepository(Student).find({
        //     relations: {
        //         teachers: true,
        //     }
        // })));

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

    afterEach(async () => {
        // tear down
        const students = await service.studentRepository.find({
            relations: {
                teachers: true,
            }
        })
        await service.studentRepository.remove(students);
        const teachers = await service.teacherRepository.find({
            relations: {
                students: true,
            }
        })
        await service.teacherRepository.remove(teachers);
    });

    afterAll(async( ) => {
        await service.dbConnection.closeConnection();
    })
});


