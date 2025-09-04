import {Router} from 'express';
import {PatientController} from '../controllers/patient.js' 

const route = Router();

route.post('/', PatientController.store);

export default route;