import { DataBaseConnection } from "./db/connect";

// Takes care of opening and closing DB connection per request;
export function createHandler<Req, Res>(
    controller: (...args: Req[]) => Promise<Res>, dbConnection: DataBaseConnection
) {
    return async(...args:Req[]) => {
        await dbConnection.connectToDb();
        const resp = await controller(...args);
        console.log('Response: ', JSON.stringify(resp));
        await dbConnection.closeConnection();
        return resp;
    }
}