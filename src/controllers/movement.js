import prisma from '../prisma.js';

export const MovementController = {

  async store(req, res, next) {
    try {
      const { medicationId, userId, doctorId, date, quantity, movementType } = req.body;

      const movement = await prisma.movement.create({
        data: {
          medicationId: Number(medicationId),
          userId: Number(userId),
          doctorId: doctorId ? Number(doctorId) : null,
          quantity: Number(quantity),
          date,
          movementType
        },
        include: {
          user: true,
          doctor: true,
          medication: true
        }
      });

      res.status(201).json(movement);

    } catch (err) {
      next(err);
    }
  },

  async index(req, res, next) {
    try {
      let query = {};

      if (req.query.medicationId) query.medicationId = Number(req.query.medicationId);
      if (req.query.userId) query.userId = Number(req.query.userId);
      if (req.query.doctorId) query.doctorId = Number(req.query.doctorId);
      if (req.query.date) query.date = new Date(req.query.date);
      if (req.query.quantity) query.quantity = Number(req.query.quantity);
      if (req.query.movementType) query.movementType = req.query.movementType;

      const movements = await prisma.movement.findMany({
        where: query,
        include: {
          user: true,
          doctor: true,
          medication: true
        }
      });

      res.status(200).json(movements);

    } catch (err) {
      next(err);
    }
  },

  async show(req, res, _next) {
    try {
      const id = Number(req.params.id);

      const movement = await prisma.movement.findFirstOrThrow({
        where: { id },
        include: {
          user: true,
          doctor: true,
          medication: true
        }
      });

      res.status(200).json(movement);

    } catch (err) {
      res.status(404).json({ error: "Movimento não encontrado" });
    }
  },

  async delete(req, res, _next) {
    try {
      const id = Number(req.params.id);

      const movement = await prisma.movement.delete({
        where: { id }
      });

      res.status(200).json(movement);

    } catch (err) {
      res.status(404).json({ error: "Movimento não encontrado" });
    }
  },

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);

      let update = {};

      if (req.body.quantity) update.quantity = Number(req.body.quantity);
      if (req.body.movementType) update.movementType = req.body.movementType;
      if (req.body.userId) update.userId = Number(req.body.userId);
      if (req.body.doctorId) update.doctorId = Number(req.body.doctorId);
      if (req.body.medicationId) update.medicationId = Number(req.body.medicationId);
      if (req.body.date) update.date = new Date(req.body.date);

      const movement = await prisma.movement.update({
        where: { id },
        data: update,
        include: {
          user: true,
          doctor: true,
          medication: true
        }
      });

      res.status(200).json(movement);

    } catch (err) {
      next(err);
    }
  }
};
