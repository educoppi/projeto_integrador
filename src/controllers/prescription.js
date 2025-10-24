import prisma from '../prisma.js';

export const PrescriptionController = {

    async store(req, res, next) {
        try {
            const {recordId, medicationName, quantity, observation} = req.body;

           let r = await prisma.record.findFirst({
                where: {id: Number(recordId)}
            });

            if(!r){
                res.status(301).json({
                    'error':"Record informado não encontrado"
                });
                return
            }

            const p = await prisma.prescription.create(
                {
                    data: {
                          recordId: Number(recordId),
                          medicationName: medicationName,
                          quantity: Number(quantity),
                          observation: observation
                    }
                }
            );

            res.status(201).json(p);

        } catch (err) {
            next(err);
        }
    },
    async index(req,res,next){

        let query = {}

        if (req.query.recordId) query = {recordId: Number(req.query.recordId)}
        if (req.query.medicationName) query = {medicationName: req.query.medicationName}
        if (req.query.quantity) query = {quantity:{gte: Number(req.query.quantity)}}
        if (req.query.observation) query = {observation: req.query.observation}


        const prescriptions = await prisma.prescription.findMany({ 
            where: query
         })

        res.status(200).json(prescriptions);
        
    },
    async show(req, res, _next) {
        try{
            const id = Number(req.params.id)
    
            const p = await prisma.prescription.findFirstOrThrow({
                where: {id}
            })
    
            res.status(200).json(p)
        }catch(err){
            res.status(404).json({error:"Prescrição não encontrada"});
        }
    },
    async del(req,res,_next) {
        try{
            const id = Number(req.params.id)
    
            const p = await prisma.prescription.delete({
                where: {id}
            })
    
            res.status(200).json(p)
        }catch(err){
            res.status(404).json({error:"Prescrição não encontrada para deletar"});
        }
    },
    async update(req,res,_next) {
        try{
            const id = Number(req.params.id);
            const {quantity, medicationName, observation} = req.body

            const dataToUpdate = {};
            if (quantity !== undefined) dataToUpdate.quantity = Number(quantity);
            if (medicationName !== undefined) dataToUpdate.medicationName = medicationName;
            if (observation !== undefined) dataToUpdate.observation = observation;

            const prescription = await prisma.prescription.update({
                where: {
                    id: id
                },
                data: {
                    dataToUpdate: dataToUpdate
                }
            })

            res.status(200).json(prescription)
        }catch(err){
            res.status(404).json({error:"Erro prescrição não atualizada"})
        }
    }
}
