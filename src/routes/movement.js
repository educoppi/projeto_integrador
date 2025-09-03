import {Router} from 'express';
import {MovementController} from '../controllers/movement' 

const route = Router();

route.post('/', MovementController.store);

export default route;