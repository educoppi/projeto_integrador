import {Router} from 'express';
import {RecordController} from '../controllers/record.js' 

const route = Router();

route.post('/', RecordController.store);
route.get('/:id', RecordController.show);//<> para buscar um item em vez da lista toda 
route.get('/', RecordController.index);
route.delete('/:id', RecordController.del);
route.put('/:id', RecordController.update);

export default route;


