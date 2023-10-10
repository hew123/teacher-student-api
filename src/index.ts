import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { DataBaseConnection } from './db/connect';
import { DatabaseConfig } from './db-config';
import { RegistrationController } from './controller';
import { RegistrationService } from './service';
import { 
    ErrorResponse, 
    GetCommonStudentsRequest, 
    GetCommonStudentsResponse, 
    NotifyRequest, 
    NotifyResponse, 
    RegisterRequest,
    RegisterResponse,
    SuspendRequest,
    SuspendResponse,
    isErrRespWithCode 
} from './model/dto';
import { createHandler } from './handler';

const dbConnection = new DataBaseConnection(DatabaseConfig);
const registrationService = new RegistrationService(dbConnection);
const registrationController = new RegistrationController(registrationService);

const registerHandler = createHandler(registrationController.register, dbConnection);
const getCommonStudentsHandler = createHandler(registrationController.getCommonStudents, dbConnection);
const suspendHandler = createHandler(registrationController.suspend, dbConnection);
const notifyHandler = createHandler(registrationController.notify, dbConnection);

const app: Express = express();
// Hardcoded port number as required if undefined
const port = process.env.PORT || '8080';

// Express 4.x has unbundled middlewares,
// hence need to explicitly attach JSON body parser
// https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
app.use(bodyParser.json());

// logging middleware
app.use((req, res, next) => {
    console.log('Request: ', JSON.stringify(req.path), JSON.stringify(req.query), JSON.stringify(req.body));
    next()
})

app.get('/api/commonstudents', async(
    req: Request<undefined, undefined, undefined, GetCommonStudentsRequest>, 
    res: Response<GetCommonStudentsResponse | ErrorResponse>
    ) => {
        const resp = await getCommonStudentsHandler(req.query);
        isErrRespWithCode(resp) ? 
            res.status(resp.statusCode).json({ message: resp.message}): 
            res.status(200).json(resp);
});

app.post('/api/register', async(
    req: Request<undefined, undefined, RegisterRequest>, 
    res: Response<RegisterResponse | ErrorResponse>
    ) => {
        const resp = await registerHandler(req.body);
        isErrRespWithCode(resp) ? 
            res.status(resp.statusCode).json({ message: resp.message}): 
            res.status(204).json(resp);
});

app.post('/api/suspend', async(
    req: Request<undefined, undefined, SuspendRequest>, 
    res: Response<SuspendResponse | ErrorResponse>
    ) => {
        const resp = await suspendHandler(req.body);
        isErrRespWithCode(resp) ? 
            res.status(resp.statusCode).json({ message: resp.message}): 
            res.status(204).json(resp);
});

app.post('/api/retrievefornotifications', async(
    req: Request<undefined, undefined, NotifyRequest>, 
    res: Response<NotifyResponse | ErrorResponse>
    ) => {
    const resp = await notifyHandler(req.body);
    isErrRespWithCode(resp) ? 
        res.status(resp.statusCode).json({ message: resp.message}): 
        res.status(200).json(resp);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});