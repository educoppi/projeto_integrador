import {Router} from 'express';
import {PrescriptionController} from '../controllers/prescription.js' 

const route = Router();

route.post('/', PrescriptionController.store);
route.get('/:id', PrescriptionController.show);
route.get('/', PrescriptionController.index);
route.delete('/:id', PrescriptionController.del);

export default route;