import {Router} from 'express';
import {MedicationController} from '../controllers/medication' //importar a variável criada 

const route = Router();

route.post('/', MedicationController.store); // recebe dois parametros: caminho e função

export default route; 