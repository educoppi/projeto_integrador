import prisma from '../prisma.js';


export const MovementController = {

    async store(req, res, next) {
        try {
            const { medicationId, userId, date, quantity, movementType } = req.body;

            const m = await prisma.movement.create(
                {
                    data: {
                        medicationId: Number(medicationId),
                        userId: Number(userId),
                        quantity: Number(quantity),
                        date,
                        movementType
                    }
                }
            );

            res.status(201).json(m);

        } catch (err) {
            next(err);
        }
    },

    async index(req, res, next) {

        const movement = await prisma.movement.findMany()

        res.status(200).json(movement) //200 é o código de sucesso de retorno no prisma
    }
}