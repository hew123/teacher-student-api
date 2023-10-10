import {Entity, Column, PrimaryColumn, ManyToMany} from "typeorm";
import {Teacher} from "./teacher";

@Entity()
export class Student {

    @PrimaryColumn()
    email: string;

    @Column()
    suspended: boolean;

    // This allows querying of student-teachers from Student table
    // although Teacher table is the one owning the relation
    // Omitting this only allows querying of teacher-students from Teacher table
    @ManyToMany(() => Teacher, (teacher) => teacher.students, { onDelete: 'CASCADE'})
    //@ts-ignore
    teachers: Teacher[];

    constructor(email: string, suspended: boolean = false) {
        this.email = email;
        this.suspended = suspended;
    }
}