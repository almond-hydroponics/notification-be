import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IUserInputDTO } from '../../interfaces/IUser';
import { AppLogger } from '../../../lib/logger';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';

const {

} = middlewares;

const logger = new AppLogger('User');
const user = Router();

const path = 'USERS';

export default (app: Router): void => {

};
