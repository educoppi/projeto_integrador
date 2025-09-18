import prisma from '../prisma.js';

// CRUD
// C - CREATE, INSERT, POST, SET, STORE

export const MedicationController = {

    //assíncrono nome_da_função(recebendo, responder, próxima coisa a ser executada)
    async store(req, res, next) {
        try {
            const { name, quantity, type, expiresAt } = req.body; //dentro das variáveis vão os itens da tabela, caso tenha camel case, precisa estar exatamente igual

            //nome da const é primeira letra do modelo 
            const m = await prisma.medication.create({
                data: {
                    name,
                    quantity: Number(quantity),
                    type,
                    expiresAt
                }
            });

            //respondendo 201 (criado) e encapsulando no formato JSON a variável m
            res.status(201).json(m); //201 é o código para a função de criação
        } catch (err) {
            next(err);
        }

    },

    async index(req, res, next) {

        let query = {}

        if (req.query.name) query = { name: req.query.name }
        if (req.query.type) query = { type: req.query.type }
        if (req.query.quantity) query = { quantity: req.query.quantity }
        if (req.query.expiresAt) query = { expiresAt: req.query.expiresAt }

        const medications = await prisma.medication.findMany({
            where: query
        })

        res.status(200).json(medications) //200 é o código de sucesso de retorno no prisma
    },
    async show(req, res, _next) {
        try {
            const id = Number(req.params.id);  //PRECISA DO NUMBER PQ O JSON TRANSFORMA TUDO EM STRING

            // funções assincronas precisam do await
            const u = await prisma.medication.findFirstOrThrow({
                where: { id }
            }); //função para encontrar o primeiro user com a id especificada, se não encontrar retorna um erro

            res.status(200).json(u);

        } catch (err) {
            res.status(404).json({ error: "Usuário não encontrado" });
        }
    },
    async delete(req, res, _next) {
        try {
            const id = Number(req.params.id);  //PRECISA DO NUMBER PQ O JSON TRANSFORMA TUDO EM STRING

            // funções assincronas precisam do await
            const u = await prisma.medication.delete({
                where: { id }
            }); //função para encontrar o primeiro user com a id especificada, se não encontrar retorna um erro

            res.status(200).json(u);

        } catch (err) {
            res.status(404).json({ error: "Usuário não encontrado" });
        }
    }


}