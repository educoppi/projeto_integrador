import prisma from '../prisma.js';

export const PrescriptionController = {

    async store(req, res, next) {
        try {
            // Agora esperamos: recordId, text e observation
            const { recordId, text, observation } = req.body;

            let r = await prisma.record.findFirst({
                where: { id: Number(recordId) }
            });

            if (!r) {
                res.status(404).json({
                    error: "Record informado não encontrado"
                });
                return;
            }

            // Criação da prescrição apenas com texto e observação
            const p = await prisma.prescription.create({
                data: {
                    recordId: Number(recordId),
                    text: text,
                    observation: observation || null
                }
            });

            res.status(201).json(p);

        } catch (err) {
            next(err);
        }
    },

    async index(req, res, next) {
        let query = {};

        if (req.query.recordId) query = { recordId: Number(req.query.recordId) };
        if (req.query.text) query = { text: { contains: req.query.text } };
        if (req.query.observation) query = { observation: { contains: req.query.observation } };

        const prescriptions = await prisma.prescription.findMany({
            where: query
        });

        res.status(200).json(prescriptions);
    },

    async show(req, res, _next) {
        try {
            const id = Number(req.params.id);

            const p = await prisma.prescription.findFirstOrThrow({
                where: { id }
            });

            res.status(200).json(p);
        } catch (err) {
            res.status(404).json({ error: "Prescrição não encontrada" });
        }
    },

    async del(req, res, _next) {
        try {
            const id = Number(req.params.id);

            const p = await prisma.prescription.delete({
                where: { id }
            });

            res.status(200).json(p);
        } catch (err) {
            res.status(404).json({ error: "Prescrição deletada ou inexistente" });
        }
    },

    async update(req, res, _next) {
        try {
            const id = Number(req.params.id);
            const { text, observation } = req.body;

            const prescription = await prisma.prescription.update({
                where: { id },
                data: {
                    text,
                    observation
                }
            });

            res.status(200).json(prescription);
        } catch (err) {
            res.status(404).json({ error: "Erro: prescrição não atualizada" });
        }
    }
};
