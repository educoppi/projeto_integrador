import prisma from '../prisma.js';

export const PrescriptionController = {

    async store(req, res, next) {
        try {
            const {recordId, medicationId, quantity} = req.body;

            const p = await prisma.prescription.create(
                {
                    data: {
                          recordId: Number(recordId),
                          medicationId: Number(medicationId),
                          quantity: Number(quantity)
                       
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
        if (req.query.medicationId) query = {medicationId: Number(req.query.medicationId)}
        if (req.query.quantity) query = {quantity:{gte: Number(req.query.quantity)}}


        const prescriptions = await prisma.prescription.findMany({ 
            where: query
         })

        res.status(200).json(prescriptions)
    }
}