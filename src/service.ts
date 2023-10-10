import { In, Repository } from 'typeorm';
import { Teacher } from './db/teacher';
import { Student } from './db/student';
import { Email } from './model/email';
import { DataBaseConnection } from './db/connect';
import { RequestError } from './model/error';

export class RegistrationService {
    teacherRepository: Repository<Teacher>;
    studentRepository: Repository<Student>;
    constructor(
        readonly dbConnection: DataBaseConnection
    ) {
        this.teacherRepository = dbConnection.getRepository(Teacher);
        this.studentRepository = dbConnection.getRepository(Student);
    }

    // TODO: check if can retrieve student Ids with the full details to optimize db ops
    // TODO: check if studentA.teachers = [teacher1]
    //       if add teacher2.students = [studentA]
    //       then will we get studentA.teachers = [teacher1, teacher2]
    // TODO: retrieve recursively teachers.students.teachers
    async register(teacherEmail: Email, studentEmails: Email[]): Promise<void> {
        let teacher = await this.teacherRepository.findOne({
            relations: {
                students: true,
            },
            where: { email: teacherEmail.text }
        });

        if (teacher === null) {
            console.log(`Teacher by ${teacherEmail.text} does not exist. Creating...`);
            teacher = new Teacher(teacherEmail.text);
        }
        // TODO: add test 
        // This is to avoid overwriting students already created
        const students = await this.studentRepository.findBy({
            email: In(studentEmails),
        });
        const registeredStudents = teacher.students ?? [];
        const existingIds = new Set(students.map((s) => s.email));
        const studentsToAdd = studentEmails.filter((email) => !existingIds.has(email.text))
                                            .map((email) => new Student(email.text));
        // TODO: add test to ensure existing registered students do not get overwrite
        teacher.students = [...registeredStudents, ...students, ...studentsToAdd];

        await this.teacherRepository.save(teacher);
    }

    // TODO: add test
    async getCommonStudents(teacherEmails: Email[]): Promise<Student[]> {
        // i.e. SELECT * FROM student-teachers 
        // WHERE teacher.email = 'A' OR teacher.email = 'B' OR OR teacher.email = 'C' 
        const students = await this.studentRepository.find({
            relations: {
                teachers: true,
            },
            where: {
                teachers: { email: In(teacherEmails.map((e) => e.text))}
            }
        });
        const requestedTeacherIds = new Set(teacherEmails.map((t) => t.text));
        return students.filter((student) => {
            const teacherIds = new Set(student.teachers.map((t) => t.email));
            return isSubset(requestedTeacherIds, teacherIds);
        })
    }

    async suspend(studentEmail: Email): Promise<void> {
        const student = await this.studentRepository.findOne({
            where: { email: studentEmail.text }
        });
        if (student === null) {
            throw new RequestError(`Student ${studentEmail.text} does not exist.`);
        }

        student.suspended = true;
        await this.studentRepository.save(student);
    }

    async getNonSuspendedStudents(teacherEmail: Email): Promise<Student[]> {
        const teacher = await this.teacherRepository.findOne({
            relations: {
                students: true,
            },
            where: { 
                email: teacherEmail.text,
                students: {
                    suspended: false
                }
            }
        });
        if (teacher === null) {
            throw new RequestError(`Teacher ${teacherEmail} does not exist.`);
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