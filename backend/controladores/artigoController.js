const prisma = require('../prismaClient');

// LISTAR E PESQUISAR ARTIGOS
async function listarArtigos(req, res) {
    try {
        const {
            busca,
            categoriaId,
            produtoId,
            pagina = 1,
            limite = 10
        } = req.query;

        const numeroPagina = Math.max(1, Number(pagina));
        const quantidade = Math.min(100, Math.max(1, Number(limite)));

        const filtros = {
            status: 'PUBLICADO'
        };

        if (busca) {
            filtros.OR = [
                { titulo: { contains: busca, mode: 'insensitive' } },
                { resumo: { contains: busca, mode: 'insensitive' } },
                { conteudo: { contains: busca, mode: 'insensitive' } }
            ];
        }

        if (categoriaId) {
            filtros.categoriaId = Number(categoriaId);
        }

        if (produtoId) {
            filtros.produtoId = Number(produtoId);
        }

        const [artigos, total] = await prisma.$transaction([
            prisma.artigoConhecimento.findMany({
                where: filtros,
                include: {
                    categoria: true,
                    autor: {
                        select: {
                            id: true,
                            nome: true
                        }
                    },
                    produto: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                },
                orderBy: {
                    criadoEm: 'desc'
                },
                skip: (numeroPagina - 1) * quantidade,
                take: quantidade
            }),

            prisma.artigoConhecimento.count({
                where: filtros
            })
        ]);

        res.json({
            total,
            pagina: numeroPagina,
            limite: quantidade,
            totalPaginas: Math.ceil(total / quantidade),
            artigos
        });

    } catch (erro) {
        console.error('Erro ao listar artigos:', erro);
        res.status(500).json({
            mensagem: 'Erro ao consultar artigos.'
        });
    }
}

// BUSCAR ARTIGO POR ID
async function buscarArtigo(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID do artigo inválido.'
            });
        }

        const artigo = await prisma.artigoConhecimento.findUnique({
            where: { id },
            include: {
                categoria: true,
                autor: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                produto: true,
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });

        if (!artigo || artigo.status !== 'PUBLICADO') {
            return res.status(404).json({
                mensagem: 'Artigo não encontrado.'
            });
        }

        res.json(artigo);

    } catch (erro) {
        console.error('Erro ao buscar artigo:', erro);
        res.status(500).json({
            mensagem: 'Erro ao consultar artigo.'
        });
    }
}

// CADASTRAR ARTIGO COM TAGS
async function criarArtigo(req, res) {
    try {
        const {
            titulo,
            resumo,
            conteudo,
            autorId,
            categoriaId,
            produtoId,
            tags = []
        } = req.body;

        if (!titulo || !conteudo || !autorId || !categoriaId) {
            return res.status(400).json({
                mensagem: 'Título, conteúdo, autor e categoria são obrigatórios.'
            });
        }

        if (!Array.isArray(tags)) {
            return res.status(400).json({
                mensagem: 'As tags devem ser enviadas em uma lista.'
            });
        }

        const nomesTags = [
            ...new Set(
                tags
                    .filter(tag => typeof tag === 'string')
                    .map(tag => tag.trim())
                    .filter(Boolean)
            )
        ];

        const artigo = await prisma.$transaction(async (transacao) => {

            const tagsCadastradas = await Promise.all(
                nomesTags.map(nome =>
                    transacao.tag.upsert({
                        where: { nome },
                        update: {},
                        create: { nome }
                    })
                )
            );

            return transacao.artigoConhecimento.create({
                data: {
                    titulo,
                    resumo,
                    conteudo,
                    autorId: Number(autorId),
                    categoriaId: Number(categoriaId),
                    produtoId: produtoId ? Number(produtoId) : null,
                    status: 'PUBLICADO',

                    tags: {
                        create: tagsCadastradas.map(tag => ({
                            tag: {
                                connect: { id: tag.id }
                            }
                        }))
                    }
                },
                include: {
                    categoria: true,
                    produto: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });
        });

        res.status(201).json({
            mensagem: 'Artigo cadastrado com sucesso!',
            artigo
        });

    } catch (erro) {
        console.error('Erro ao cadastrar artigo:', erro);

        res.status(500).json({
            mensagem: 'Erro ao cadastrar artigo.'
        });
    }
}

module.exports = {
    listarArtigos,
    buscarArtigo,
    criarArtigo
};