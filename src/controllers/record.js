import prisma from '../prisma.js';

export const RecordController = {
    // C - CREATE (INSERT)
    async store(req, res, next) {
        try {
            const { patientId, appointmentDate, level, symptom, recentMedicine, annotationTriage } = req.body;

            // 🔍 validações básicas
            if (!annotationTriage || annotationTriage.trim().length < 10) {
                return res.status(400).json({ error: "A anotação deve ter pelo menos 10 caracteres" });
            }

            const p = await prisma.user.findFirst({
                where: { id: Number(patientId) }
            });

            if (!p) {
                return res.status(404).json({ error: "Paciente não encontrado" });
            }

            const u = await prisma.user.findFirst({
                where: { id: req.usuario.id }
            });

            if (!u) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // 🩺 criação do registro
            const r = await prisma.record.create({
                data: {
                    patientId: Number(patientId),
                    appointmentDate: new Date(appointmentDate),
                    level: level ? Number(level) : null,
                    symptom,
                    recentMedicine,
                    annotationTriage: annotationTriage.trim(),
                }
            });

            // Atualiza situação do paciente
            await prisma.user.update({
                where: { id: Number(patientId) },
                data: { situation: "AGUARDANDO ATENDIMENTO" }
            });

            res.status(201).json(r);
        } catch (err) {
            next(err);
        }
    },

    // R - READ (LISTA DE REGISTROS)
    async index(req, res, next) {
        try {
            const records = await prisma.record.findMany({
                include: {
                    patient: { select: { name: true, situation: true } },
                    user: { select: { name: true } },
                    prescription: {
                        select: { id: true, observation: true },
                    },
                },
                orderBy: { appointmentDate: 'desc' },
            });

            res.status(200).json(records);
        } catch (err) {
            next(err);
        }
    },

    // R - READ (UM REGISTRO ESPECÍFICO)
    async show(req, res) {
        try {
            const id = Number(req.params.id);

            const r = await prisma.record.findFirstOrThrow({
                where: { id },
                include: {
                    patient: { select: { name: true } },
                    user: { select: { name: true } },
                    prescription: true,
                },
            });

            res.status(200).json(r);
        } catch {
            res.status(404).json({ error: "Registro não encontrado" });
        }
    },

    // D - DELETE
    async del(req, res) {
        try {
            const id = Number(req.params.id);

            const d = await prisma.record.delete({
                where: { id },
            });

            res.status(200).json(d);
        } catch {
            res.status(404).json({ error: "Registro não encontrado ou já deletado" });
        }
    },

    // U - UPDATE
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const dataToUpdate = {};

            if (req.body.appointmentDate)
                dataToUpdate.appointmentDate = new Date(req.body.appointmentDate);
            if (req.body.annotationTriage)
                dataToUpdate.annotationTriage = req.body.annotationTriage.trim();
            if (req.body.annotationMedic)
                dataToUpdate.annotationMedic = req.body.annotationMedic.trim();


            const updated = await prisma.record.update({
                where: { id },
                data: dataToUpdate,
            });

            res.status(200).json(updated);
        } catch {
            res.status(404).json({ error: "Erro: registro não atualizado" });
        }
    },
    async finalizar(req, res, next) {



        const id = Number(req.params.id);
        const dataToUpdate = {};

        if (req.body.annotationMedic)
            dataToUpdate.annotationMedic = req.body.annotationMedic.trim();


        const updated = await prisma.record.update({
            where: { id },
            data: dataToUpdate,
        });

        const exam = await prisma.exam.create({
            data: {
                recordId: id,
                date: new Date(),
                observation: req.body.observationExam
            }
        });

        const prescription = await prisma.prescription.create({
            data: {
                recordId: id,
                date: new Date(),
                text: req.body.text,
                observation: req.body.observationPrescription
            }
        });

        res.status(200).json(updated);
    }
};
