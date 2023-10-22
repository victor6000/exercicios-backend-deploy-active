const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;

    try {
        const products = await knex('produtos').where({ usuario_id: usuario.id })
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

const findProduct = async (userID, productID) => {
    const product = await knex('produtos')
        .where({ usuario_id: userID })
        .andWhere({ id: productID })
        .first();
    return product;
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const product = await findProduct(usuario.id, id);
        if (!product) return res.status(404).json(product);

        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) return res.status(404).json('O campo nome é obrigatório');
    if (!estoque) return res.status(404).json('O campo estoque é obrigatório');
    if (!preco) return res.status(404).json('O campo preco é obrigatório');
    if (!descricao) return res.status(404).json('O campo descricao é obrigatório');

    try {
        const newProductInfo = {
            usuario_id: usuario.id,
            nome,
            estoque,
            preco,
            categoria,
            descricao,
            imagem
        }

        const newProduct = await knex('produtos').insert(newProductInfo).returning('*');
        if (!newProduct) return res.status(400).json('O produto não foi cadastrado');

        return res.status(200).json(newProduct[0]);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');

    try {
        const product = await findProduct(usuario.id, id);
        if (!product) return res.status(404).json('Produto não encontrado');

        const update = {
            nome,
            estoque,
            preco,
            categoria,
            descricao,
            imagem
        };

        const updatedProduct = await knex('produtos')
            .update(update)
            .where({ usuario_id: usuario.id })
            .andWhere({ id })
            .returning('*');

        if (!updatedProduct) return res.status(400).json("O produto não foi atualizado");

        return res.status(200).json({ mensagem: "Produto Atualizado com Sucesso!" });
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const product = await findProduct(usuario.id, id);
        if (!product) return res.status(404).json('Produto não encontrado');

        const deletedProduct = await knex('produtos')
            .del()
            .where({ usuario_id: usuario.id })
            .andWhere({ id })
            .returning('*');

        if (!deletedProduct) return res.status(400).json("O produto não foi excluido");

        return res.status(200).json({ mensagem: "Produto Excluido com Sucesso!" });
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}