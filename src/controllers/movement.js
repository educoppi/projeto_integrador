import prisma from '../prisma';


export const MovementController = {

    async store(req, res, next) {
        try {
            const { medicationId, userId, date, quantity, movementType } = req.body;

            const m = await prisma.movement.create(
                {
                    data: {
                        medicationId,
                        userId,
                        quantity,
                        date,
                        movementType
                    }
                }
            );

            res.status(201).json(m);

        } catch (err) {
            next(err);
        }
    }
}