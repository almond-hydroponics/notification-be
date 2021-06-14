import expressLoader from './expressLoader';
import dependencyInjectorLoader from './dependencyInjector';

import { AppLogger } from '../../lib/logger';
import mongooseLoader from './mongoose';

import * as user from '../models/user';


export default async ({ expressApp }): Promise<void> => {
    const logger = new AppLogger('Loaders');
    const mongoConnection = await mongooseLoader();
    logger.log('✌️ Database loaded and connected!');

    const userModel = {
        name: 'userModel',
        model: user.default,
    };

    const { agenda } = await dependencyInjectorLoader({
        mongoConnection,
        models: [
          userModel
        ],
    });
    logger.log('✌️ Dependency Injector loaded');

    await expressLoader({ app: expressApp, agendaInstance: agenda });
    logger.log('✌️ Express loaded');
};
