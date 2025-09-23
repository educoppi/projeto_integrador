import {Router} from 'express';
import {PrescriptionController} from '../controllers/prescription.js' 

const route = Router();

route.post('/', PrescriptionController.store);
route.get('/:id', PrescriptionController.show);
route.get('/', PrescriptionController.index);
route.delete('/:id', PrescriptionController.del);
route.delete('/:id', PrescriptionController.del);
route.delete('/:id', PrescriptionController.del);
route.put('/:id', PrescriptionController.update);

export default route;