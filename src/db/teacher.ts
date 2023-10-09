import {Entity, PrimaryColumn, ManyToMany, JoinTable} from "typeorm";
import {Student} from "./student";

@Entity()
export class Teacher {

    @PrimaryColumn()
    email: string;

    // @ManyToMany(type => Student, student => student.teachers)
    // @JoinTable()
    // students: Student[];

    constructor(email: string, students: Student[] = []) {
        this.email = email;
        //this.students = students;
    }
}
