import {Router} from 'express';
import {ExamController} from '../controllers/exam.js' 

const route = Router();

route.post('/', ExamController.store);

export default route;