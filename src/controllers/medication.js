import prisma from '../prisma';

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
                    quantity,
                    type,
                    expiresAt
                }
            });

            //respondendo 201 (criado) e encapsulando no formato JSON a variável m
            res.status(201).json(m); //201 é o código para a função de criação
        } catch (err) {
            next(err);
        }

    }
}