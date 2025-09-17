import prisma from '../prisma.js';

export const RecordController = {

    async store(req, res, next) {
        try {
            const {patientId, appointmentDate  } = req.body;

            const r = await prisma.record.create({
                data: {
                    patientId: Number(patientId),
                    appointmentDate: new Date(appointmentDate)
                }
            });

            res.status(201).json(r);

        } catch (err) {
            next(err);
        }
    },
    async index(req,res,next){
        let query ={}
        if (req.query.patientId) query = {patientId: Number(req.query.patientId)}
        if (req.query.appointmentDate) query = {appointmentDate: new Date(req.query.appointmentDate)}
        const records = await prisma.record.findMany()
        res.status(200).json(records)
    }
}
