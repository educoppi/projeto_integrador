import {Router} from 'express';
import {MedicationController} from '../controllers/medication.js' //importar a variável criada 

const route = Router();

route.post('/', MedicationController.store); // recebe dois parametros: caminho e função
route.get('/', MedicationController.index);

export default route; 