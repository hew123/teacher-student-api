import { In } from 'typeorm';
import { Teacher } from './db/teacher';
import { Student } from './db/student';
import { Email } from './model/email';
import { DataBaseConnection } from './db/connect';

export class TeacherStudentPersistenceService {
    constructor(
        readonly dbConnection: DataBaseConnection
    ) {}

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

    async suspend(studentEmail: Email): Promise<void> {
        const student = await this.dbConnection.getRepository(Student).findOne({
            where: { email: studentEmail.id }
        });
        if (student === null) {
            throw new Error(`Student ${studentEmail.id} does not exist.`);
        }

        student.suspended = true;
        await this.dbConnection.getRepository(Student).save(student);
    }

    async getNonSuspendedStudents(teacherEmail: Email): Promise<Student[]> {
        const teacher = await this.dbConnection.getRepository(Teacher).findOne({
            relations: {
                students: true,
            },
            where: { 
                email: teacherEmail.id,
                students: {
                    suspended: false
                }
            }
        });
        if (teacher === null) {
            throw new Error(`Teacher ${teacherEmail} does not exist.`);
        }
        return teacher.students;
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