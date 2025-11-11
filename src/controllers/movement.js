import prisma from '../prisma.js';

export const MovementController = {

  async storeDoctor(req, res, next) {
    try {
      const { medicationId, quantity } = req.body;


      const medication = await prisma.medication.findUnique({
        where: { id: Number(medicationId) } // busca o estoque do remédio
      });

      if (!medication) {
        return res.status(404).json({ error: 'Medicamento não encontrado.' });
      }

      const [movement, updatedMedication] = await prisma.$transaction([ // transaction é utilizado para movimentações complexas, primeiro testa e depois completa ou reverte tudo
        prisma.movement.create({
          data: {
            medicationId: Number(medicationId),
            userId: null,
            doctorId: Number(req.usuario.id),
            quantity: Number(quantity),
            date: new Date(),
            movementType: 'OUTBOUND',
            approvedMovement: false,
          },
          include: {
            user: true,
            doctor: true,
            medication: true
          }
        })
      ]);

      res.status(201).json({
        movement,
        updatedMedication
      });

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
      if (req.query.approvedMovement) query.approvedMovement = Boolean(req.query.approvedMovement);

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
      if (req.body.approvedMovement) update.approvedMovement = Boolean(req.body.approvedMovement);

      console.log(req.body.approvedMovement);

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
  },

  async updateFarmacia(req, res, next) {
    try {
      const id = Number(req.params.id);

      const movement = await prisma.movement.findFirstOrThrow({
        where: { id },
        include: {
          doctor: true,
          medication: true
        }
      });

      const medicationId = movement.medicationId;

      const medication = await prisma.medication.findFirstOrThrow({
        where: { id: medicationId }
      });
      


      let newQuantity = movement.quantity;

      if (medication.quantity < movement.quantity) {
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque.' });
      }

      newQuantity -= Number(movement.quantity);

      prisma.medication.update({
        where: { id: Number(medicationId) },
        data: { quantity: newQuantity }
      })

      let update = {};

      update.approvedMovement = Boolean(true);
      update.userId = Number(req.usuario.id);

      const movementUpdate = await prisma.movement.update({
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
