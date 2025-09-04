import prisma from '../prisma.js';

export const PatientController = {

    async store(req, res, next) {
        try {
            const { name, lastName, birth, cpf, email, phone, address, allergyDescription } = req.body;

            const p = await prisma.movement.create(
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
    }
}


/*   name String
  lastName String @map("last_name")
  birth DateTime
  cpf String @unique
  email String @unique
  phone String
  address String
  allergyDescription String @map("allergy_description")
  medicalRecord String @map("medical_record") */