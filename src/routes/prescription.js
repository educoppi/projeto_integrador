import {Router} from 'express';
import {PrescriptionController} from '../controllers/prescription.js' 

const route = Router();

route.post('/', PrescriptionController.store);

export default route;