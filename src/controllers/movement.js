import prisma from '../prisma';


export const MovementController = {

    async store(req, res, next) {
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
    }
}