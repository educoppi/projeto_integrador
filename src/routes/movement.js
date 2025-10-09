import {Router} from 'express';
import {MovementController} from '../controllers/movement.js' 

const route = Router();

route.post('/', MovementController.store);
route.get('/', MovementController.index);
route.get('/:id', MovementController.show);
route.delete('/:id',  MovementController.delete);
route.put('/:id', MovementController.update);

export default route;