import {Router} from 'express';
import {MovementController} from '../controllers/movement.js' 

const route = Router();

route.post('/',verificaToken, verificaRole('PHARMACY'), MovementController.store);
route.get('/',verificaToken, verificaRole('PHARMACY'), MovementController.index);
route.get('/:id',verificaToken, verificaRole('PHARMACY'), MovementController.show);
route.delete('/:id', verificaToken, verificaRole('PHARMACY'), MovementController.delete);
route.put('/:id',verificaToken, verificaRole('PHARMACY'), MovementController.update);

export default route;