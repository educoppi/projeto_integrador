import prisma from '../prisma.js';

export const Record = {

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
    }
}
/*
model Record {
  
  patientId Int @map("patient_id")
  appointmentDate DateTime @map("appointment_date")*/