import {Router} from 'express';
import {PrescriptionController} from '../controllers/prescription.js' 
import { verificaToken } from '../middlewares/auth.js';

const route = Router();

route.post('/', verificaToken, PrescriptionController.store);
route.get('/:id', verificaToken, PrescriptionController.show);
route.get('/', verificaToken, PrescriptionController.index);
route.delete('/:id', verificaToken, PrescriptionController.del);
route.put('/:id', verificaToken, PrescriptionController.update);

export default route;