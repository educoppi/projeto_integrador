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
    { name: 'ADMIN',   description: 'Acesso total ao sistema'},
    { name: 'EDITOR',  description: 'Pode criar/editar conteúdos'},
    { name: 'VIEWER',  description: 'Somente leitura'},
    { name: 'OWNER',   description: 'Responsável pelo grupo/projeto' },
    { name: 'deleteHabit',   description: 'Pode deletar um hábito' }
  ];

  const roles = {};
  for (const r of rolesData) {
    const role = await upsertRole(r);
    roles[role.name] = role; // roles.ADMIN, roles.EDITOR, etc, os names passados acimas
  }

  // 2) Cria Groups
  const groupsData = [
    { name: 'Docentes',        description: 'Professores' },
    { name: 'Lider de projetos',description: 'Membro do grupo que tem mais facilidade' },
    { name: 'Estudantes',description: 'Squad do projeto' }
  ];

  const groups = {};
  for (const g of groupsData) {
    const group = await upsertGroup(g);
    groups[group.name] = group; // groups['Turma TI43'], etc.
  }

  // 3) Vincula Roles aos Groups
  // Crie um nome para a unique composta no schema para permitir upsert,
  // ex: @@unique([groupId, roleId], name: "group_role_unique")
  await connectRoleToGroup({ groupId: groups['Docentes'].id,        roleId: roles.ADMIN.id });
  await connectRoleToGroup({ groupId: groups['Docentes'].id,        roleId: roles.EDITOR.id });
  await connectRoleToGroup({ groupId: groups['Docentes'].id,        roleId: roles.VIEWER.id });
  await connectRoleToGroup({ groupId: groups['Docentes'].id,        roleId: roles.deleteHabit.id });

  await connectRoleToGroup({ groupId: groups['Lider de projetos'].id, roleId: roles.OWNER.id });
  await connectRoleToGroup({ groupId: groups['Lider de projetos'].id, roleId: roles.EDITOR.id });
  await connectRoleToGroup({ groupId: groups['Lider de projetos'].id, roleId: roles.VIEWER.id });

  await connectRoleToGroup({ groupId: groups['Estudantes'].id, roleId: roles.VIEWER.id });

  // 4) (Opcional) Vincula Users a Groups
  // Se já existir User com id 1 e 2, por exemplo:
  try {
    await connectUserToGroup({ userId: 1, groupId: groups['Docentes'].id });
  } catch {}

  console.log('Seed concluído com Roles, Groups, RoleGroup e GroupUser');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
