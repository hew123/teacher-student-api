import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "foo",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
    //insecureAuth: true,
    //extra: { insecureAuth: true }
})
