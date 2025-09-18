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

        let query = {}

        if (req.query.name) query = { name: req.query.name }
        if (req.query.type) query = { type: req.query.type }
        if (req.query.quantity) query = { quantity: req.query.quantity }
        if (req.query.expiresAt) query = { expiresAt: req.query.expiresAt }

        const medications = await prisma.movement.findMany({
            where: query
        })

        res.status(200).json(medications) //200 é o código de sucesso de retorno no prisma
    },
    async show(req, res, _next) {
        try {
            const id = Number(req.params.id);  //PRECISA DO NUMBER PQ O JSON TRANSFORMA TUDO EM STRING

            // funções assincronas precisam do await
            const u = await prisma.movement.findFirstOrThrow({
                where: { id }
            }); //função para encontrar o primeiro user com a id especificada, se não encontrar retorna um erro

            res.status(200).json(u);

        } catch (err) {
            res.status(404).json({ error: "Usuário não encontrado" });
        }
    },
    async delete(req, res, _next) {
        try {
            const id = Number(req.params.id);  //PRECISA DO NUMBER PQ O JSON TRANSFORMA TUDO EM STRING

            // funções assincronas precisam do await
            const u = await prisma.movement.delete({
                where: { id }
            }); //função para encontrar o primeiro user com a id especificada, se não encontrar retorna um erro

            res.status(200).json(u);

        } catch (err) {
            res.status(404).json({ error: "Usuário não encontrado" });
        }
    }
}