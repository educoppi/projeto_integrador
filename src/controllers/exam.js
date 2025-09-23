import prisma from '../prisma.js';

export const ExamController = {

    async store(req, res, next) {
        try {
            const {recordId, date, type, result, observation } = req.body;
               
            let r = await prisma.record.findFirst({
                where: { id: Number(recordId) }
            });
            if(!r){
                res.status(301).json({ error: "Prontuário não encontrado" })
                return
            }
            


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
    },
    async index(req,res, next){
        
        let query = {}

        if (req.query.recordId) query = {recordId: Number(req.query.recordId)}
        if (req.query.date) query = {date: new Date(req.query.date)}
        if (req.query.type) query = {type: req.query.type}
        if (req.query.result) query = {result: req.query.result}
        if (req.query.observation) query = {observation: req.query.observation}


        const exams = await prisma.exam.findMany({
            where: query
        })
        res.status(200).json(exams)
    }


}
