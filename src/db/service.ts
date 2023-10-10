import { DataSource, In } from 'typeorm';
import { Teacher } from './teacher';
import { Student } from './student';
import { Email } from '../email';

export class TeacherStudentPersistenceService {
    constructor(
        readonly dbConnection: DataSource
    ) {}

    async connectToDb(): Promise<void>{
        console.log('Connecting to DB...')
        if (this.dbConnection.isInitialized) {
            console.log('DB already connected.');
        }
        else {
            await this.dbConnection.initialize();
            console.log('DB connected.');
        }
    }
    // TODO: should call this only once from handler
    async closeConnection(): Promise<void>{
        console.log('Closing connection to DB...')
        await this.dbConnection.destroy();
        console.log('Connection closed.')
    }

    // TODO: use connection wrapper for all funcs

    // TODO: check if can retrieve student Ids with the full details to optimize db ops
    // TODO: check if studentA.teachers = [teacher1]
    //       if add teacher2.students = [studentA]
    //       then will we get studentA.teachers = [teacher1, teacher2]
    // TODO: retrieve recursively teachers.students.teachers
    async register(teacherEmail: Email, studentEmails: Email[]): Promise<void> {
        let teacher = await this.dbConnection.getRepository(Teacher).findOne({
            relations: {
                students: true,
            },
            where: { email: teacherEmail.id }
        });

        if (teacher === null) {
            console.log(`Teacher by ${teacherEmail.id} does not exist. Creating...`);
            teacher = new Teacher(teacherEmail.id);
        }

        // TODO: add test 
        // This is to avoid overwriting students already created
        const students = await this.dbConnection.getRepository(Student).findBy({
            email: In(studentEmails),
        });
        const registeredStudents = teacher.students ?? [];
        const existingIds = new Set(students.map((s) => s.email));
        const studentsToAdd = studentEmails.filter((email) => !existingIds.has(email.id))
                                            .map((email) => new Student(email.id));
        // TODO: add test to ensure existing registered students do not get overwrite
        teacher.students = [...registeredStudents, ...students, ...studentsToAdd];

        await this.dbConnection.getRepository(Teacher).save(teacher);
    }

    // TODO: add test
    async getCommonStudents(teacherEmails: Email[]): Promise<Student[]> {
        // i.e. SELECT * FROM student-teachers 
        // WHERE teacher.email = 'A' OR teacher.email = 'B' OR OR teacher.email = 'C' 
        const students = await this.dbConnection.getRepository(Student).find({
            relations: {
                teachers: true,
            },
            where: {
                teachers: { email: In(teacherEmails.map((e) => e.id))}
            }
        });
        const requestedTeacherIds = new Set(teacherEmails.map((t) => t.id));
        return students.filter((student) => {
            const teacherIds = new Set(student.teachers.map((t) => t.email));
            return isSubset(requestedTeacherIds, teacherIds);
        })
    }

    async suspend(email: Email): Promise<void> {
        const student = await this.dbConnection.getRepository(Student).findOne({
            where: { email: email.id }
        });
        if (student === null) {
            throw new Error(`Student ${email.id} does not exist.`);
        }

        student.suspended = true;
        await this.dbConnection.getRepository(Student).save(student);
    }
}


function isSubset(subset: Set<string>, set: Set<string>): boolean {
    for (const val of subset.values()) {
        if (!set.has(val)) {
            return false;
        }
    }
    return true;
}