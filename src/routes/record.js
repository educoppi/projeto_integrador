import {Router} from 'express';
import {RecordController} from '../controllers/record.js';
import { verificaToken } from '../middlewares/auth.js';

const route = Router();

route.post('/', verificaToken, RecordController.store);
route.get('/:id', RecordController.show);//<> para buscar um item em vez da lista toda 
route.get('/', RecordController.index);
route.delete('/:id', verificaToken, RecordController.del);
route.put('/:id', verificaToken, RecordController.update);

export default route;


