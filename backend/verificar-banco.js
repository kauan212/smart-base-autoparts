const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificar() {
    const resultado = {
        usuarios: await prisma.usuario.count(),
        categorias: await prisma.categoria.count(),
        produtos: await prisma.produto.count(),
        veiculos: await prisma.veiculo.count(),
        tags: await prisma.tag.count(),
        artigos: await prisma.artigoConhecimento.count(),
        aplicacoes: await prisma.aplicacaoVeicular.count(),
        artigosTags: await prisma.artigoTag.count()
    };

    console.log('\n=== CONFERÊNCIA DO BANCO DE DADOS ===');
    console.table(resultado);
}

verificar()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });