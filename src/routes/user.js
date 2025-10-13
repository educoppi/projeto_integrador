import {Router} from 'express';
import {UserController} from '../controllers/user.js' 
import { verificaToken } from '../middlewares/auth.js';
import { verificaRole } from '../middlewares/roles.js';

const route = Router();

route.post('/', verificaToken, UserController.store);
route.post('/patient', verificaToken, UserController.storePatient);
route.post('/login', UserController.login);
route.get('/logado', verificaToken, UserController.logado);
route.get('/', UserController.index);
route.get('/:id', verificaToken, UserController.show); // ":id" é o nome do parametro (req.params.id). ".show" é o novo metodo criado no controller
route.delete('/:id', verificaToken, UserController.delete);
route.put('/:id', verificaToken, UserController.update);
export default route;