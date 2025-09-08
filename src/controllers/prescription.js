import prisma from '../prisma.js';

export const prescription = {

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
    }
}