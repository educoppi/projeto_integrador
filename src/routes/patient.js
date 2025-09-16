import {Router} from 'express';
import {PatientController} from '../controllers/patient.js' 

const route = Router();

route.post('/', PatientController.store);
route.get('/', PatientController.index);

export default route;