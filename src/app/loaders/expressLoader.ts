import { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import requestIp from 'request-ip';
import expressStatusMonitor from 'express-status-monitor';
import expressRateLimit from 'express-rate-limit';
import methodOverride from 'method-override';
import connectRedis from 'connect-redis';
import Agendash from 'agendash';
import Agenda from 'agenda';
import morgan from 'morgan';
import { AppLogger } from '../../lib/logger';

import routes from '../api';
import { config } from '../../config';
import corsOptions from '../../config/cors';
import redisClient from './redis';

import statusMonitor from '../../config/statusMonitor';
import morganMiddleware from "../../config/morganMiddleware";

const { isProduction, clientUrl, api } = config;
const logger = new AppLogger('Express');

const rateLimiter = expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

export default ({
                    app,
                    agendaInstance,
                }: {
    app: Application;
    agendaInstance: Agenda;
}): void => {
    app.use(morganMiddleware)
    app.use(expressStatusMonitor(statusMonitor));
    app.get('/status', (req, res) => res.status(200).end());
    app.head('/status', (req, res) => res.status(200).end());
    app.use('/agenda-dash', Agendash(agendaInstance));
    app.use(rateLimiter);
    app.enable('trust proxy');
    app.use(requestIp.mw());
    app.use(cors(corsOptions));
    app.use(methodOverride());
    app.use(bodyParser.json({ limit: '2mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    isProduction && app.use(helmet());
    const redisStore = connectRedis(expressSession);
    app.use(
        expressSession({
            secret: config.sessionSecret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false,
                domain: config.cookiesDomain,
            },
            store: new redisStore({ client: redisClient }),
        }),
    );

    app.get('/', (req, res) => {
        res.redirect(clientUrl);
    });

    app.use(api.prefix, routes());
    app.use((req: Request, res: Response, next: NextFunction) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            return res.status(err.status).send({ message: err.message }).end();
        }
        return next(err);
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message,
            },
        });
    });
};
