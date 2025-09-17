import {Router} from 'express';
import {UserController} from '../controllers/user.js' 

const route = Router();

route.post('/', UserController.store);
route.get('/', UserController.index);
route.get('/:id', UserController.show); // ":id" é o nome do parametro (req.params.id). ".show" é o novo metodo criado no controller
route.delete('/:id', UserController.delete);
export default route;