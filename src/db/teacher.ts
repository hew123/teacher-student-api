import {Entity, PrimaryColumn, ManyToMany, JoinTable} from "typeorm";
import {Student} from "./student";

@Entity()
export class Teacher {

    @PrimaryColumn()
    email: string;

    // This creates a separate relation table in MySQL for teacher-students
    @ManyToMany(() => Student, (student) => student.teachers, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable()
    //@ts-ignore
    students: Student[];

    constructor(email: string) {
        this.email = email;
    }
}
