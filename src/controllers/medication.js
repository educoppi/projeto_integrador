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
                    quantity:Number(quantity),
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

    async index(req, res, next){
      
        const medications = await prisma.medication.findMany()
        
        res.status(200).json(medications) //200 é o código de sucesso de retorno no prisma
    }


}