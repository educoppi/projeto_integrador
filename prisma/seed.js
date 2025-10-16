import bcrypt from "bcrypt";

// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helpers idempotentes (usam únicos `name`)
async function upsertRole({ name, description }) {
  return prisma.role.upsert({
    where: { name },
    update: { description },
    create: { name, description }
  });
}

async function upsertGroup({ name, description }) {
  return prisma.group.upsert({
    where: { name },
    update: { description },
    create: { name, description }
  });
}

// Vincula papel ao grupo (idempotente via @@unique([groupId, roleId]))
async function connectRoleToGroup({ groupId, roleId }) {
  return prisma.roleGroup.upsert({
    where: {
      // precisa de um identificador único. Criaremos um “composite key surrogate”
      // usando @@unique([groupId, roleId]) → Prisma exige um nome. Podemos usar um find+create:
      // Porém o upsert requer um unique. Alternativa: try/catch create.
      // Para usar upsert puro, crie um unique artificial:
      // @@unique([groupId, roleId], name: "group_role_unique")
      groupId_roleId: { groupId, roleId } // nomeamos a unique como "groupId_roleId"
    },
    update: {},
    create: { groupId, roleId }
  });
}

// Vincula user ao grupo (idempotente via @@unique([userId, groupId]))
async function connectUserToGroup({ userId, groupId }) {
  return prisma.groupUser.upsert({
    where: {
      userId_groupId: { userId, groupId } // idem: nomeie a unique
    },
    update: {},
    create: { userId, groupId }
  });
}

async function main() {
  // 1) Cria Roles
  const rolesData = [

    // MEDICACAO
    { name: 'CREATEMEDICATION', description: 'Cria remédios' },
    { name: 'GETMEDICATION', description: 'Lista remédios' },
    { name: 'UPDATEMEDICATION', description: 'Atualiza remédios' },
    { name: 'MOVEMENTMEDICATION', description: 'Movimenta remédios' },

    // RECEITAS
    { name: 'CREATEPRESCRIPTION', description: 'Cria Receitas' },
    { name: 'GETPRESCRIPTION', description: 'Lista receitas' },
    { name: 'UPDATEPRESCRIPTION', description: 'Atualiza' },

    //EXAMES
    { name: 'CREATEEXAM', description: 'Cria encaminhamentos' },
    { name: 'GETEXAM', description: 'Lista encaminhamentos' },
    { name: 'UPDATEEXAM', description: 'Atualiza encaminhamentos' },

    //USUARIOS
    { name: 'CREATEUSER', description: 'Cria Usuário' },
    { name: 'GETUSER', description: 'Lista Usuário' },
    { name: 'UPDATEUSER', description: 'Atualiza Usuário' },

    //HISTORICO
    { name: 'CREATERECORD', description: 'Cria Histórico' },
    { name: 'GETRECORD', description: 'Lista Histórico' },
    { name: 'UPDATERECORD', description: 'Atualiza Histórico' }
  ];

  const roles = {};
  for (const r of rolesData) {
    const role = await upsertRole(r);
    roles[role.name] = role; // roles.ADMIN, roles.EDITOR, etc, os names passados acimas
  }

  // 2) Cria Groups
  const groupsData = [
    { name: 'RECEPCIONIST', description: 'Recepcionista' },
    { name: 'DOCTOR',description: 'Doutor' },
    { name: 'PHARMACY',description: 'Farmacêutico' },
    { name: 'PATIENT',description: 'Paciente' },
    { name: 'NURSE',description: 'Enfermagem' },
    { name: 'ADMIN',description: 'Administrador' }
  ];

  const groups = {};
  for (const g of groupsData) {
    const group = await upsertGroup(g);
    groups[group.name] = group; // groups['Turma TI43'], etc.
  }

  // 3) Vincula Roles aos Groups
  // Crie um nome para a unique composta no schema para permitir upsert,
  // ex: @@unique([groupId, roleId], name: "group_role_unique")
  await connectRoleToGroup({ groupId: groups['ADMIN'].id, roleId: roles.GETUSER.id });
  await connectRoleToGroup({ groupId: groups['ADMIN'].id, roleId: roles.CREATEUSER.id });
  await connectRoleToGroup({ groupId: groups['ADMIN'].id, roleId: roles.UPDATEUSER.id });

  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.GETMEDICATION.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.CREATEPRESCRIPTION.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.GETPRESCRIPTION.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.UPDATEPRESCRIPTION.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.CREATEEXAM.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.GETEXAM.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.UPDATEEXAM.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.GETUSER.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.UPDATEUSER.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.CREATERECORD.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.GETRECORD.id });
  await connectRoleToGroup({ groupId: groups['DOCTOR'].id, roleId: roles.UPDATERECORD.id });

  await connectRoleToGroup({ groupId: groups['PHARMACY'].id, roleId: roles.CREATEMEDICATION.id });
  await connectRoleToGroup({ groupId: groups['PHARMACY'].id, roleId: roles.GETMEDICATION.id });
  await connectRoleToGroup({ groupId: groups['PHARMACY'].id, roleId: roles.UPDATEMEDICATION.id });
  await connectRoleToGroup({ groupId: groups['PHARMACY'].id, roleId: roles.MOVEMENTMEDICATION.id });

  await connectRoleToGroup({ groupId: groups['RECEPCIONIST'].id, roleId: roles.CREATEUSER.id });
  await connectRoleToGroup({ groupId: groups['RECEPCIONIST'].id, roleId: roles.GETUSER.id });
  await connectRoleToGroup({ groupId: groups['RECEPCIONIST'].id, roleId: roles.UPDATEUSER.id });

  await connectRoleToGroup({ groupId: groups['NURSE'].id, roleId: roles.UPDATEUSER.id });
  await connectRoleToGroup({ groupId: groups['NURSE'].id, roleId: roles.UPDATERECORD.id });

  // 4) (Opcional) Vincula Users a Groups
  // Se já existir User com id 1 e 2, por exemplo:
  try {

    let cpf = 1;
    for (const group of groupsData) {
      const hash = await bcrypt.hash("123456", 10);

      const user = await prisma.user.create(
          {
              data: {
                  name: group.name,
                  lastName: "sobrenome",
                  password: hash,
                  cpf: "123467890" + cpf.toString(),
                  phone: "19888887777",
                  email: group.name + "@gmail.com",
                  allergy: "nenhuma",
                  birthDate: "2025-09-04T19:51:38.868Z"
              }
          }
      );

      cpf++;
    }



    await connectUserToGroup({ userId: 1, groupId: groups['RECEPCIONIST'].id });
    await connectUserToGroup({ userId: 2, groupId: groups['DOCTOR'].id });
    await connectUserToGroup({ userId: 3, groupId: groups['PHARMACY'].id });
    await connectUserToGroup({ userId: 4, groupId: groups['PATIENT'].id });
    await connectUserToGroup({ userId: 5, groupId: groups['NURSE'].id });
    await connectUserToGroup({ userId: 6, groupId: groups['ADMIN'].id });
  } catch {}

  console.log('Seed concluído com Roles, Groups, RoleGroup e GroupUser');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
