import prisma from '../prisma.js';

export const RecordController = {
  // C - CREATE (INSERT)
  async store(req, res, next) {
    try {
      const { patientId, appointmentDate, anotacao } = req.body;

      // 🔍 validações básicas antes de criar o registro
      if (!anotacao || anotacao.trim().length < 10) {
        return res
          .status(400)
          .json({ error: "A anotação deve ter pelo menos 10 caracteres" });
      }

      const p = await prisma.user.findFirst({
        where: { id: Number(patientId) },
      });

      if (!p) {
        return res.status(404).json({ error: "Paciente não encontrado" });
      }

      if (p.role !== "PATIENT") {
        return res.status(401).json({ error: "Usuário informado não é um paciente" });
      }

      const u = await prisma.user.findFirst({
        where: { id: req.usuario?.id },
      });

      if (!u) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (u.role === "PATIENT") {
        return res.status(401).json({ error: "Usuário não pode ser um paciente" });
      }

      // 🩺 criação do registro (record)
      const r = await prisma.record.create({
        data: {
          patientId: Number(patientId),
          appointmentDate: new Date(appointmentDate),
          annotation: anotacao.trim(),
          userId: req.usuario?.id || 1, // fallback
        },
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
          patient: { select: { name: true } },
          user: { select: { name: true } },
          prescription: {
            select: {
              id: true,
              observation: true,
            },
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
  async show(req, res, _next) {
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
    } catch (err) {
      res.status(404).json({ error: "Registro não encontrado" });
    }
  },

  // D - DELETE
  async del(req, res, _next) {
    try {
      const id = Number(req.params.id);

      const d = await prisma.record.delete({
        where: { id },
      });

      res.status(200).json(d);
    } catch (err) {
      res.status(404).json({ error: "Registro não encontrado ou já deletado" });
    }
  },

  // U - UPDATE
  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      const dataToUpdate = {};

      if (req.body.appointmentDate)
        dataToUpdate.appointmentDate = new Date(req.body.appointmentDate);
      if (req.body.annotation)
        dataToUpdate.annotation = req.body.annotation.trim();

      const updated = await prisma.record.update({
        where: { id },
        data: dataToUpdate,
      });

      res.status(200).json(updated);
    } catch (err) {
      res.status(404).json({ error: "Erro: registro não atualizado" });
    }
  },
};
