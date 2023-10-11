import "reflect-metadata"
import { DataSourceOptions } from "typeorm"
import { Student } from "./db/student"
import { Teacher } from "./db/teacher"

export const DatabaseConfig: DataSourceOptions = {
    type: "mysql",
    host: process.env.NODE_ENV === 'docker' ? 'mysql' : 'localhost',
    port: 3306,
    username: "root",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [Teacher, Student],
    migrations: [],
    subscribers: [],
};
