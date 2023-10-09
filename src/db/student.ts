import {Entity, Column, PrimaryColumn, ManyToMany} from "typeorm";
import {Teacher} from "./teacher";

@Entity()
export class Student {

    @PrimaryColumn()
    email: string;

    @Column()
    suspended: boolean;

    // @ManyToMany(type => Teacher, teacher => teacher.students)
    // teachers: Teacher[];

    constructor(email: string, suspended: boolean = false, teachers: Teacher[] = []) {
        this.email = email;
        this.suspended = suspended;
        //this.teachers = teachers; 
    }
}