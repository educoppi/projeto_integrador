import {Router} from 'express';
import {RecordController} from '../controllers/record.js' 

const route = Router();

route.post('/', RecordController.store);

export default route;