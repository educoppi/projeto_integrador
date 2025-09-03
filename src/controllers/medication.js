import prisma from '../prisma';

// CRUD
// C - CREATE, INSERT, POST, SET, STORE


//assíncrono nome_da_função(recebendo, responder, próxima coisa a ser executada)

export const MedicationController = {

    async store(req, res, next) {
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
    }

}