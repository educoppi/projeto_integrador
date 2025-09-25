import prisma from '../prisma.js';

export const UserController = {

    async store(req, res, next) {
        try {
            const { name, lastName, password, cpf, phone, email, role } = req.body;

            // if(!validaCPF(cpf)) {
            //         res.status(401).json('erro': 'CPF inválido')
            // }
            
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
    },
    async show(req, res, _next){
        try{
        const id = Number(req.params.id);  //PRECISA DO NUMBER PQ O JSON TRANSFORMA TUDO EM STRING

        // funções assincronas precisam do await
        const u = await prisma.user.findFirstOrThrow({
            where: { id }
        }); //função para encontrar o primeiro user com a id especificada, se não encontrar retorna um erro

        res.status(200).json(u);

        } catch (err){
            res.status(404).json({error: "Usuário não encontrado"});
        }
    },
    async delete(req, res, _next){
        try{
            const id = Number(req.params.id);  //PRECISA DO NUMBER PQ O JSON TRANSFORMA TUDO EM STRING
    
            // funções assincronas precisam do await
            const u = await prisma.user.delete({
                where: { id }
            }); //função para encontrar o primeiro user com a id especificada, se não encontrar retorna um erro
    
            res.status(200).json(u);
    
            } catch (err){
                res.status(404).json({error: "Usuário não encontrado"});
            }
    },
    async update(req, res, _next){
        try{
            
            const id = Number(req.params.id);
    
            let dataUpdate = {}
    
            if (req.body.name) dataUpdate.name = req.body.name
            if (req.body.lastName) dataUpdate.lastName = req.body.lastName
            if (req.body.password) dataUpdate.password = req.body.password
            if (req.body.cpf) dataUpdate.cpf = req.body.cpf
            if (req.body.phone) dataUpdate.phone = req.body.phone
            if (req.body.email) dataUpdate.email = req.body.email
            if (req.body.role) dataUpdate.role = req.body.role
    
            const u = await prisma.user.update({
                where: {
                    id: id
                },
                data: dataUpdate
            })
    
            res.status(200).json(u)
        } catch (err){
            res.status(404).json({error: "Usuário não encontrado"});
        }

    }
}
