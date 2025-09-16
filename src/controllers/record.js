import prisma from '../prisma.js';

export const RecordController = {

    async store(req, res, next) {
        try {
            const {patientId, appointmentDate  } = req.body;

            const r = await prisma.record.create(
                {
                    data: {
                       patientId: Number(patientId),
                       appointmentDate: appointmentDate
                    }
                }
            );

            res.status(201).json(r);

        } catch (err) {
            next(err);
        }
    },
    async index(req,res,next){
        const records =await prisma.record.findMany()
        res.status(200).json(records)
    }
}
