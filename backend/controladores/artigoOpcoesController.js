const prisma = require('../prismaClient');

async function listarOpcoesArtigo(req, res) {
    try {
        const [autores, categorias, produtos] = await Promise.all([
            prisma.usuario.findMany({
                where: { ativo: true },
                select: {
                    id: true,
                    nome: true
                },
                orderBy: { nome: 'asc' }
            }),

            prisma.categoria.findMany({
                select: {
                    id: true,
                    nome: true
                },
                orderBy: { nome: 'asc' }
            }),

            prisma.produto.findMany({
                select: {
                    id: true,
                    nome: true,
                    codigo: true
                },
                orderBy: { nome: 'asc' }
            })
        ]);

        res.json({
            autores,
            categorias,
            produtos
        });

    } catch (erro) {
        console.error('Erro ao carregar opções:', erro);

        res.status(500).json({
            mensagem: 'Erro ao carregar opções do cadastro.'
        });
    }
}

module.exports = {
    listarOpcoesArtigo
};
