import prisma from '../prisma.js';

// CRUD
// C - CREATE, INSERT, POST, SET, STORE

export const MedicationController = {

    //assíncrono nome_da_função(recebendo, responder, próxima coisa a ser executada)
    async store(req, res, next) {
        try {
            const { name, quantity, dosage, type, expiresAt } = req.body;

            if (!name || !quantity || !dosage || !type || !expiresAt) {
                return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
            }

            // primeira validação para impedir cadastro se o medicamento já existir
            const medicamentoExistente = await prisma.medication.findFirst({
                where: {
                    name: name.toLowerCase(),
                    dosage,
                }
            });

            if (medicamentoExistente) {
                return res.status(409).json({ message: 'Medicamento com esse nome e dosagem já está cadastrado.' });
            }

            const m = await prisma.medication.create({
                data: {
                    name: name.toLowerCase(),
                    dosage,
                    quantity: Number(quantity),
                    type,
                    expiresAt,
                }
            });

            res.status(201).json(m);
        } catch (err) {
            next(err);
        }
    },

    async index(req, res, _next) {

        let query = {}

        if (req.query.name) query.name = req.query.name

        if (req.query.type) query.type = req.query.type

        if (req.query.dosage) query.dosage = req.query.dosage

        if (req.query.quantity) query.quantity = Number(req.query.quantity)

        if (req.query.min) query.quantity = { lt: Number(req.query.min) }
        if (req.query.minig) query.quantity = { lte: Number(req.query.minig) }
        if (req.query.max) query.quantity = { gt: Number(req.query.max) }
        if (req.query.maxig) query.quantity = { gte: Number(req.query.maxig) }


        if (req.query.expiresAt) query.expiresAt = req.query.expiresAt

        const medications = await prisma.medication.findMany({
            where: query
        })

        res.status(200).json(medications) //200 é o código de sucesso de retorno no prisma
    },
    async show(req, res, _next) {
        try {
            const id = Number(req.params.id);  //PRECISA DO NUMBER PQ O JSON TRANSFORMA TUDO EM STRING

            // funções assincronas precisam do await
            const medications = await prisma.medication.findFirstOrThrow({
                where: { id }
            }); //função para encontrar o primeiro user com a id especificada, se não encontrar retorna um erro

            res.status(200).json(medications);

        } catch (err) {
            res.status(404).json({ error: "Medicamento não encontrado" });
        }
    },
    async delete(req, res, _next) {
        try {
            const id = Number(req.params.id);  //PRECISA DO NUMBER PQ O JSON TRANSFORMA TUDO EM STRING

            // funções assincronas precisam do await
            const medications = await prisma.medication.delete({
                where: { id }
            }); //função para encontrar o primeiro medicamento com a id especificada, se não encontrar retorna um erro

            res.status(200).json(medications);

        } catch (err) {
            res.status(404).json({ error: "Medicamento não encontrado" });
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);

            let update = {}

            if (req.body.name) update.name = req.body.name
            if (req.body.type) update.type = req.body.type
            if (req.body.dosage) update.dosage = req.body.dosage
            if (req.body.quantity) update.quantity = Number(req.body.quantity)
            if (req.body.expiresAt) update.expiresAt = req.body.expiresAt


            const medication = await prisma.medication.update({
                where: { id },
                data: update
            });

            res.status(200).json(medication);

        } catch (err) {
            next(err);
        }
    }

}