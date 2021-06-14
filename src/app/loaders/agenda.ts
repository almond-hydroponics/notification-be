import Agenda from 'agenda';
import { config } from '../../config';

export default ({ mongoConnection }) =>
	new Agenda({
		mongo: mongoConnection,
		db: { address: '', collection: config.agenda.dbCollection, options: {} },
		processEvery: config.agenda.pooltime,
		maxConcurrency: config.agenda.concurrency,
	}) as any;
