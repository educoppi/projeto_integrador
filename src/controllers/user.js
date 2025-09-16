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
        const users = await prisma.user.findMany()

        res.status(200).json(users)
    }
}
