import prisma from '../prisma.js'

export function verificaRole(requiredRole) {
    const need = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

    return async (req, res, next) => {
        try{
          const userId = req.usuario?.id;
          if (!userId) return req.status(401).json({ erro: 'Não autenticado' });
          
          const vinculo = await prisma.roleGroup.findFirst({
            where: {
                role: { name: { in: need } },
                group: { users: { some: { userId } } },
             },
             select: { id: true}
          });

          if (!vinculo) {
            return res.status(403).json({ erro: 'Acesso negado.' });
          }
          return next();
        } catch (e) {
            console.error('verificRole error:', e);
            return res.status(403).json({erro: 'O usuário não possui permissão'});
        }
    };
}