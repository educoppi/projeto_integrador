/* recordId Int @map("record_id") @unique
  date DateTime
  type String
  result String
  observation String
  */


  import prisma from '../prisma.js';

export const exam = {

    async store(req, res, next) {
        try {
            const {recordId, date, type, result, observation } = req.body;

            const e = await prisma.exam.create(
                {
                    data: {
                          recordId: Number(recordId),
                          date,
                          type,
                          result,
                          observation
                       
                    }
                }
            );

            res.status(201).json(e);

        } catch (err) {
            next(err);
        }
    }
}
