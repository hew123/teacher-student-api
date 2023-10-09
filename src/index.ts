import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { ErrorResponse, GetCommonStudentsResponse, NotifyRequest, NotifyResponse, RegisterRequest, SuspendRequest } from './dto';

const app: Express = express();
// Hardcoded port number as required if undefined
const port = process.env.PORT || '8080';

// Express 4.x has unbundled middlewares,
// hence need to explicitly attach JSON body parser
// https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('Request: ', JSON.stringify(req.path), JSON.stringify(req.body));
    next()
})

app.get('/api/commonstudents', (
    req: Request<undefined, undefined, undefined>, 
    res: Response<GetCommonStudentsResponse | ErrorResponse>
    ) => {
        res.status(200).json();
});

app.post('/api/register', (
    req: Request<undefined, undefined, RegisterRequest>, 
    res: Response<undefined | ErrorResponse>
    ) => {
        res.status(204).json();
});

app.post('/api/suspend', (
    req: Request<undefined, undefined, SuspendRequest>, 
    res: Response<undefined | ErrorResponse>
    ) => {
    res.status(204).json();
});

app.post('/api/retrievefornotifications', (
    req: Request<undefined, undefined, NotifyRequest>, 
    res: Response<NotifyResponse | ErrorResponse>
    ) => {
    res.status(200).json();
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});