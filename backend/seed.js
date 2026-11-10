const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando população do banco de dados...');

    // ==========================================
    // 1. USUÁRIOS
    // ==========================================

    const senhaHash = await bcrypt.hash('SmartBase@2026', 10);

    const usuariosDados = [
        { nome: 'Administrador', email: 'admin@smartbase.com', tipo: 'ADMIN' },
        { nome: 'Carlos Silva', email: 'carlos@smartbase.com', tipo: 'COLABORADOR' },
        { nome: 'Mariana Souza', email: 'mariana@smartbase.com', tipo: 'COLABORADOR' },
        { nome: 'João Oliveira', email: 'joao@smartbase.com', tipo: 'COLABORADOR' },
        { nome: 'Fernanda Costa', email: 'fernanda@smartbase.com', tipo: 'COLABORADOR' }
    ];

    await prisma.usuario.createMany({
        data: usuariosDados.map(usuario => ({
            ...usuario,
            senhaHash
        })),
        skipDuplicates: true
    });

    const usuarios = await prisma.usuario.findMany();

    console.log(`${usuarios.length} usuários cadastrados.`);

    // ==========================================
    // 2. CATEGORIAS
    // ==========================================

    const categoriasNomes = [
        'Motor',
        'Freios',
        'Suspensão',
        'Transmissão',
        'Sistema Elétrico',
        'Arrefecimento',
        'Alimentação',
        'Direção',
        'Escapamento',
        'Manutenção Preventiva'
    ];

    await prisma.categoria.createMany({
        data: categoriasNomes.map(nome => ({
            nome,
            descricao: `Informações técnicas sobre ${nome.toLowerCase()} automotivo.`
        })),
        skipDuplicates: true
    });

    const categorias = await prisma.categoria.findMany();

    console.log(`${categorias.length} categorias cadastradas.`);

    // ==========================================
    // 3. PRODUTOS
    // ==========================================

    const produtosNomes = [
        'Filtro de óleo', 'Filtro de ar', 'Filtro de combustível',
        'Pastilha de freio', 'Disco de freio', 'Tambor de freio',
        'Amortecedor dianteiro', 'Amortecedor traseiro', 'Mola helicoidal',
        'Kit embreagem', 'Correia dentada', 'Correia do alternador',
        'Vela de ignição', 'Bobina de ignição', 'Bateria automotiva',
        'Radiador', 'Bomba d’água', 'Válvula termostática',
        'Bomba de combustível', 'Bico injetor', 'Sensor de rotação',
        'Terminal de direção', 'Pivô de suspensão', 'Bucha de bandeja',
        'Rolamento de roda', 'Junta homocinética', 'Coxim do motor',
        'Escapamento', 'Sonda lambda', 'Alternador'
    ];

    await prisma.produto.createMany({
        data: produtosNomes.map((nome, indice) => ({
            nome,
            codigo: `SB-${String(indice + 1).padStart(4, '0')}`,
            marca: ['Bosch', 'Nakata', 'Monroe', 'Cofap', 'Moura'][indice % 5],
            descricao: `Produto automotivo ${nome.toLowerCase()}, utilizado em sistemas de veículos.`
        })),
        skipDuplicates: true
    });

    const produtos = await prisma.produto.findMany();

    console.log(`${produtos.length} produtos cadastrados.`);

    // ==========================================
    // 4. VEÍCULOS
    // ==========================================

    const veiculosDados = [
        ['Volkswagen', 'Gol', 2010, 2022, '1.0'],
        ['Volkswagen', 'Polo', 2018, 2026, '1.0 TSI'],
        ['Volkswagen', 'Golf', 2014, 2020, '1.4 TSI'],
        ['Fiat', 'Uno', 2010, 2021, '1.0'],
        ['Fiat', 'Argo', 2018, 2026, '1.3'],
        ['Fiat', 'Palio', 2008, 2017, '1.4'],
        ['Chevrolet', 'Onix', 2013, 2026, '1.0'],
        ['Chevrolet', 'Prisma', 2013, 2019, '1.4'],
        ['Chevrolet', 'Corsa', 2002, 2012, '1.4'],
        ['Ford', 'Ka', 2015, 2021, '1.0'],
        ['Ford', 'Fiesta', 2011, 2019, '1.6'],
        ['Toyota', 'Corolla', 2015, 2026, '2.0'],
        ['Honda', 'Civic', 2012, 2021, '2.0'],
        ['Hyundai', 'HB20', 2013, 2026, '1.0'],
        ['Renault', 'Sandero', 2010, 2022, '1.6']
    ];

    await prisma.veiculo.createMany({
        data: veiculosDados.map(([fabricante, modelo, anoInicio, anoFim, motor]) => ({
            fabricante,
            modelo,
            anoInicio,
            anoFim,
            motor
        }))
    });

    const veiculos = await prisma.veiculo.findMany();

    console.log(`${veiculos.length} veículos cadastrados.`);

    // ==========================================
    // 5. APLICAÇÕES VEICULARES
    // ==========================================

    const aplicacoes = [];

    produtos.forEach((produto, indice) => {
        const veiculo1 = veiculos[indice % veiculos.length];
        const veiculo2 = veiculos[(indice + 3) % veiculos.length];

        aplicacoes.push({
            produtoId: produto.id,
            veiculoId: veiculo1.id
        });

        aplicacoes.push({
            produtoId: produto.id,
            veiculoId: veiculo2.id
        });
    });

    await prisma.aplicacaoVeicular.createMany({
        data: aplicacoes,
        skipDuplicates: true
    });

    console.log(`${aplicacoes.length} aplicações veiculares processadas.`);

    // ==========================================
    // 6. TAGS
    // ==========================================

    const tagsNomes = [
        'Diagnóstico', 'Manutenção', 'Instalação', 'Reparo',
        'Motor', 'Elétrica', 'Mecânica', 'Preventiva',
        'Corretiva', 'Desempenho', 'Segurança', 'Lubrificação',
        'Substituição', 'Defeito', 'Procedimento',
        'Ferramentas', 'Componentes', 'Compatibilidade',
        'Inspeção', 'Revisão'
    ];

    await prisma.tag.createMany({
        data: tagsNomes.map(nome => ({ nome })),
        skipDuplicates: true
    });

    const tags = await prisma.tag.findMany();

    console.log(`${tags.length} tags cadastradas.`);

    // ==========================================
    // 7. ARTIGOS DE CONHECIMENTO
    // ==========================================

    const quantidadeArtigos = 1000;

    const titulos = [
        'Como identificar problemas no sistema',
        'Procedimento correto de manutenção',
        'Diagnóstico de falhas automotivas',
        'Cuidados durante a instalação',
        'Como realizar a substituição do componente',
        'Principais causas de desgaste prematuro',
        'Verificação e inspeção preventiva',
        'Sintomas de defeitos e possíveis soluções',
        'Orientações técnicas para manutenção',
        'Compatibilidade de peças automotivas'
    ];

    const artigosExistentes = await prisma.artigoConhecimento.count();

    if (artigosExistentes === 0) {
        const artigosDados = Array.from(
            { length: quantidadeArtigos },
            (_, indice) => {
                const produto = produtos[indice % produtos.length];
                const categoria = categorias[indice % categorias.length];
                const autor = usuarios[indice % usuarios.length];

                const tituloBase = titulos[indice % titulos.length];

                return {
                    titulo: `${tituloBase} - ${produto.nome} (${indice + 1})`,
                    resumo: `Informações técnicas sobre ${produto.nome}, incluindo diagnóstico, manutenção e aplicação automotiva.`,
                    conteudo: `
ARTIGO TÉCNICO ${indice + 1}

Produto: ${produto.nome}
Código: ${produto.codigo}
Marca: ${produto.marca}

OBJETIVO:
Apresentar informações técnicas relacionadas ao componente automotivo.

DESCRIÇÃO:
Este artigo aborda características, funcionamento e aplicação do componente ${produto.nome}.

DIAGNÓSTICO:
É importante observar ruídos, desgaste, funcionamento irregular e sinais de falha.

MANUTENÇÃO:
A manutenção deve seguir as recomendações técnicas do fabricante do veículo e do componente.

PROCEDIMENTO:
1. Identificar o componente.
2. Realizar inspeção visual.
3. Verificar possíveis sinais de desgaste.
4. Consultar as especificações técnicas.
5. Realizar o procedimento adequado.

RECOMENDAÇÃO:
Sempre verificar a compatibilidade da peça com o veículo antes da instalação.

Este conteúdo é fictício e foi gerado para fins acadêmicos.
                    `.trim(),
                    status: 'PUBLICADO',
                    autorId: autor.id,
                    categoriaId: categoria.id,
                    produtoId: produto.id
                };
            }
        );

        await prisma.artigoConhecimento.createMany({
            data: artigosDados
        });

        console.log(`${quantidadeArtigos} artigos técnicos cadastrados.`);
    } else {
        console.log(`Já existem ${artigosExistentes} artigos. Nenhum novo artigo foi inserido.`);
    }

    // ==========================================
    // 8. RELACIONAMENTO ENTRE ARTIGOS E TAGS
    // ==========================================

    const artigos = await prisma.artigoConhecimento.findMany({
        select: { id: true }
    });

    const artigosTags = [];

    artigos.forEach((artigo, indice) => {
        const tag1 = tags[indice % tags.length];
        const tag2 = tags[(indice + 3) % tags.length];
        const tag3 = tags[(indice + 7) % tags.length];

        artigosTags.push(
            { artigoId: artigo.id, tagId: tag1.id },
            { artigoId: artigo.id, tagId: tag2.id },
            { artigoId: artigo.id, tagId: tag3.id }
        );
    });

    await prisma.artigoTag.createMany({
        data: artigosTags,
        skipDuplicates: true
    });

    console.log(`${artigosTags.length} relacionamentos entre artigos e tags processados.`);

    console.log('\n====================================');
    console.log('POPULAÇÃO DO BANCO CONCLUÍDA!');
    console.log('====================================');
}

main()
    .catch((erro) => {
        console.error('Erro ao popular o banco:', erro);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });