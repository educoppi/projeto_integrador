import prisma from '../prisma.js';

export const PatientController = {

    async store(req, res, next) {
        try {
            const { name, lastName, birth, cpf, email, phone, address, allergyDescription } = req.body;

            const p = await prisma.patient.create(
                {
                    data: {
                        name,
                        lastName,
                        birth,
                        cpf,
                        email,
                        phone,
                        address,
                        allergyDescription
                    }
                }
            );

            res.status(201).json(p);

        } catch (err) {
            next(err);
        }
    },
    async index(req, res, next){

        let query = {}

        if (req.query.name) query = {name: req.query.name}
        if (req.query.email) query = {email: req.query.email}
        if (req.query.cpf) query = {cpf: req.query.cpf}

        const patients = await prisma.patient.findMany({
            where: query
        })

        res.status(200).json(patients)
    }
    
}