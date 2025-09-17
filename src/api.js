import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import medicationRoutes from './routes/medication.js';
import movementRoutes from './routes/movement.js';
import userRoutes from './routes/user.js';
import patientRoutes from './routes/patient.js';
import recordRoutes from './routes/record.js';
import ExamRoutes from './routes/exam.js';
import PrescriptionRoutes from './routes/prescription.js'

const app = express(); // cria o app usando express
app.use(cors()); // avisa que o app vai usar o cors (usado para saber quem pode chamar a api)
app.use(express.json()) // avisa que o app vai utilizar o protocolo JSON para a comunicação

app.use('/medications', medicationRoutes); // todas as rotas relacionadas a remédios vão utilizar essa rota
app.use('/movements', movementRoutes);
app.use('/users', userRoutes);
app.use('/patients', patientRoutes);
app.use('/records', recordRoutes);
app.use('/exams', ExamRoutes);
app.use('/prescriptions', PrescriptionRoutes)


//Middleware de erro simples
app.use((err, _req, res, _next) => { // o _ antes do req e do next simboliza que eles não serão utilizados
    console.error(err);
    if (err.code === 'P2002'){
        return res.status(409).json({
            error: 'Registro duplicado (unique)'
        });
    }
    if (err.code === 'P2025'){
        return res.status(404).json({
            error: 'Registro não encontrado'
        });
    }
    res.status(500).json({error: 'Erro interno'});
}); 

const PORT = process.env.PORT || 3000; //busca a porta do env, se não estiver disponível, roda na 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));