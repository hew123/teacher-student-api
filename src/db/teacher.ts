import {Entity, PrimaryColumn, ManyToMany, JoinTable} from "typeorm";
import {Student} from "./student";

@Entity()
export class Teacher {

    @PrimaryColumn()
    email: string;

    // This creates a separate table in MySQL for teacherId:studentId
    @ManyToMany(type => Student, student => student.teachers)
    @JoinTable()
    //@ts-ignore
    students: Student[];

    constructor(email: string) {
        this.email = email;
    }
}
