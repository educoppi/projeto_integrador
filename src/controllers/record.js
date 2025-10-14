import prisma from '../prisma.js';

export const RecordController = {
    //req-requisição res-resposta next-próximo
    //c - CREATE,INSERT,POST,SET,STORE
    async store(req, res, next) {
        try {
            const { patientId, appointmentDate, annotation, level, symptom, recentMedicine} = req.body;

            let p = await prisma.user.findFirst({
                where: { id: Number(patientId) }
            });

            let u = await prisma.user.findFirst({
                where: { id: req.usuario.id }
            });
            
            if(!u){
                res.status(301).json({error: "Usuário não encontrado"})
                return
            }
            
            if(u.role == "PATIENT"){
                res.status(401).json({error: "Usuário não pode ser igual a um paciente"})
            }
            
            const r = await prisma.record.create({
                data: {
                    patientId: Number(patientId),
                    appointmentDate: new Date(appointmentDate),
                    annotation: annotation, 
                    userId: req.usuario.id,
                    level: Number(level),
                    symptom: symptom,
                    recentMedicine: recentMedicine
                }
                
            });
            
/*             if(r.annotation.length < 10){
             res.status(400).json({error: "A anotação deve ter pelo menos 10 caracteres"})
             return
            } */
            

            res.status(201).json(r);

        } catch (err) {
            next(err);
        }
    },
    //R - READ,SELECT,GET,FINDMANY
    async index(req, res, next) {
        let query = {}
        if (req.query.patientId) query = { patientId: Number(req.query.patientId) }
        if (req.query.appointmentDate) query = { appointmentDate: new Date(req.query.appointmentDate) }
        const records = await prisma.record.findMany()
        res.status(200).json(records)
    },
    //r-read ,select ,get  
    // //<> buscar um item em vez da lista toda
    async show(req, res, _next) {
        try {
            const id = Number(req.params.id)

            const r = await prisma.record.findFirstOrThrow({
                where: { id }
            });

            res.status(200).json(r)
        }
        catch (err) {
            res.status(404).json({ error: "Registro não encontrado" })

        }
    },
    async del(req, res, _next) {
        try {
            const id = Number(req.params.id)

            const d = await prisma.record.delete({
                where: { id }
            });

            res.status(200).json(d)
        }
        catch (err) {
            res.status(404).json({ error: "Registro não encontrado ou deletado" })

        }
    },
    async update(req, res, next) {
        try {

            const id = Number(req.params.id)
            let appointmentDate = { }

            if (req.body.appointmentDate) appointmentDate = { appointmentDate: new Date(req.body.appointmentDate) }


            const records = await prisma.record.update({

                where: {id},                
                data: appointmentDate
            })

            res.status(200).json(records)
        } catch (err) {
            res.status(404).json({ error: "erro" })

        }
    },
}
