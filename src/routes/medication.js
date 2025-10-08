import {Router} from 'express';
import {MedicationController} from '../controllers/medication.js' //importar a variável criada 

const route = Router();

route.post('/', verificaToken, verificaRole('PHARMACY'), MedicationController.store); // recebe dois parametros: caminho e função
route.get('/', verificaToken, verificaRole(['PHARMACY', 'DOCTOR']),  MedicationController.index);
route.get('/:id', verificaToken, verificaRole('PHARMACY'), MedicationController.show);
route.delete('/:id', verificaToken, verificaRole('PHARMACY'), MedicationController.delete);
route.put('/:id', verificaToken, verificaRole('PHARMACY'),  MedicationController.update);

export default route; 