import {Entity, Column, PrimaryColumn, ManyToMany} from "typeorm";
import {Teacher} from "./teacher";

@Entity()
export class Student {

    @PrimaryColumn()
    email: string;

    @Column()
    suspended: boolean;

    // This creates a separate table in MySQL for studentId:teacherId
    @ManyToMany(type => Teacher, teacher => teacher.students)
    //@ts-ignore
    teachers: Teacher[];

    constructor(email: string, suspended: boolean = false) {
        this.email = email;
        this.suspended = suspended;
    }
}