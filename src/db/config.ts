import "reflect-metadata"
import { DataSource } from "typeorm"
import { Student } from "./student"
import { Teacher } from "./teacher"

export const DatabaseConfig = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [Teacher, Student],
    migrations: [],
    subscribers: [],
})
