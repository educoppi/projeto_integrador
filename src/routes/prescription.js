import {Router} from 'express';
import {PrescriptionController} from '../controllers/prescription.js' 

const route = Router();

route.post('/', PrescriptionController.store);
route.get('/', PrescriptionController.index);

export default route;