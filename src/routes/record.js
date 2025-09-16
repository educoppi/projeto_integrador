import {Router} from 'express';
import {RecordController} from '../controllers/record.js' 

const route = Router();

route.post('/', RecordController.store);
route.get('/', RecordController.index);

export default route;


