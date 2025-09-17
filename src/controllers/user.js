import prisma from '../prisma.js';

export const UserController = {

    async store(req, res, next) {
        try {
            const { name, lastName, password, cpf, phone, email, role } = req.body;

            const u = await prisma.user.create(
                {
                    data: {
                        name,
                        lastName,
                        password,
                        cpf,
                        phone,
                        email,
                        role
                    }
                }
            );

            res.status(201).json(u);

        } catch (err) {
            next(err);
        }
    }, 
    async index(req, res, next){

        let query = {}

        if (req.query.name) query = {name: req.query.name}
        if (req.query.email) query = {email: req.query.email}
        if (req.query.cpf) query = {cpf: req.query.cpf}

        const users = await prisma.user.findMany({
            where: query
        })

        res.status(200).json(users)
    }
}
