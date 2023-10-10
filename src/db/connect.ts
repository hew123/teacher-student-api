import { DataSource, DataSourceOptions } from "typeorm";

export class DataBaseConnection extends DataSource{
    constructor(
        readonly dbConfig: DataSourceOptions
    ) {
        super(dbConfig);
    }

    async connectToDb(): Promise<void>{
        console.log('Connecting to DB...')
        if (this.isInitialized) {
            console.log('DB already connected.');
        }
        else {
            await this.initialize();
            console.log('DB connected.');
        }
    }

    async closeConnection(): Promise<void>{
        console.log('Closing connection to DB...')
        await this.destroy();
        console.log('Connection closed.')
    }
} 