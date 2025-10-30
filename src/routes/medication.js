import {Router} from 'express';
import {MedicationController} from '../controllers/medication.js' //importar a variável criada 

const route = Router();

route.post('/', MedicationController.store); // recebe dois parametros: caminho e função
route.get('/', MedicationController.index);
route.get('/alertas', MedicationController.alertasMedicamentos);
route.get('/:id', MedicationController.show);
route.delete('/:id', MedicationController.delete);
route.put('/:id',  MedicationController.update);

export default route; 