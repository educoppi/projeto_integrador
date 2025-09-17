


  import prisma from '../prisma.js';

export const ExamController = {

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
    },
    async index(req,res,next){
<<<<<<< HEAD
        
        let query = {}

        if (req.query.recordId) query = {recordId: Number(req.query.recordId)}
        if (req.query.date) query = {date: new Date(req.query.date)}
        if (req.query.type) query = {type: req.query.type}
        if (req.query.result) query = {result: req.query.result}
        if (req.query.observation) query = {observation: req.query.observation}
        

        const exams = await prisma.exam.findMany({
            where: query
        })
=======
        let query ={}
        if (req.query.recordId) query = {recordId: Number(req.query.recordId)}
        if (req.query.type) query = {type: req.query.type}
        if (req.query.date) query = {date: new Date(req.query.date)}
        if (req.query.result) query = {result: req.query.result}
        if (req.query.observation) query = {observation: req.query.observation}
        const exams = await prisma.exam.findMany()
>>>>>>> c489db9e7f543c87e6ef38727dee0012fe062df1
        res.status(200).json(exams)
    }


}
