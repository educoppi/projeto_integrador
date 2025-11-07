import {Router} from 'express';
import {MovementController} from '../controllers/movement.js' 

const route = Router();

route.post('/', MovementController.storeFarmacia);
route.post('/', MovementController.storeDoctor);
route.get('/', MovementController.index);
route.get('/:id', MovementController.show);
route.delete('/:id', MovementController.delete);
route.put('/:id', MovementController.update);

export default route;