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

    async register(teacherEmail: Email, studentEmails: Email[]): Promise<Teacher> {
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
        // Retrieving existing students and reusing in save()
        // to ensure we do not overwrite existing attributes e.g. suspended flag
        const existingStudents = await this.studentRepository.findBy({
            email: In(studentEmails.map((e) => e.text)),
        });
        const existingIds = new Set(existingStudents.map((s) => s.email));
        // Any registered students need to be appended as well
        // otherwise save() will treat it as 'to remove'
        const registeredStudents = teacher.students?.filter((s) => !existingIds.has(s.email)) ?? [];
        const studentsToAdd = studentEmails.filter((email) => !existingIds.has(email.text))
                                            .map((email) => new Student(email.text));
        teacher.students = [...registeredStudents, ...existingStudents, ...studentsToAdd];

        return await this.teacherRepository.save(teacher);
    }

    async getCommonStudents(teacherEmails: Email[]): Promise<Student[]> {
        // i.e. SELECT * FROM students
        // LEFT JOIN student-teachers AS a ON students.email = student-teachers.studentId
        // WHERE student-teachers.teacherId IN ('A','B','C')
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

    async suspend(studentEmail: Email): Promise<Student> {
        const student = await this.studentRepository.findOne({
            where: { email: studentEmail.text }
        });
        if (student === null) {
            throw new RequestError(`Student ${studentEmail.text} does not exist.`);
        }
        student.suspended = true;
        return await this.studentRepository.save(student);
    }

    async getUnsuspendedStudents(teacherEmail: Email): Promise<Student[]> {
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

    async getAllTeachers(): Promise<Teacher[]> {
        return await this.teacherRepository.find({
            relations: {
                students: true,
            }
        });
    }

    async getAllStudents(): Promise<Student[]> {
        return await this.studentRepository.find({
            relations: {
                teachers: true,
            }
        });
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