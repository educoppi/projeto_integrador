import {Router} from 'express';
import {RecordController} from '../controllers/record.js';
import { verificaToken } from '../middlewares/auth.js';

const route = Router();

route.post('/', verificaToken, RecordController.store);
route.get('/:id',verificaToken, RecordController.show);//<> para buscar um item em vez da lista toda 
route.get('/',verificaToken, RecordController.index);
route.delete('/:id', verificaToken, RecordController.del);
route.put('/:id', verificaToken, RecordController.update);
route.put('/finalizar/:id', verificaToken, RecordController.finalizar);

export default route;


