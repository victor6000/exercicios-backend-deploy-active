const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) return res.status(404).json("O campo nome é obrigatório");
    if (!email) return res.status(404).json("O campo email é obrigatório");
    if (!senha) return res.status(404).json("O campo senha é obrigatório");
    if (!nome_loja) return res.status(404).json("O campo nome_loja é obrigatório");

    try {
        const user = await knex('usuarios').where({ email }).first();
        if (user) return res.status(400).json("O email já existe");

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const newUserInfo = {
            nome,
            email,
            senha: senhaCriptografada,
            nome_loja
        }

        const newUser = await knex('usuarios').insert(newUserInfo).returning(['nome', 'email', 'nome_loja']);

        if (!newUser) return res.status(400).json("O usuário não foi cadastrado.");

        return res.status(200).json(newUser[0]);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => res.status(200).json(req.usuario);

const atualizarPerfil = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome && !email && !senha && !nome_loja) return res.status(400).json('É obrigatório informar ao menos um campo para atualização');

    try {

        if (email === req.usuario.email) {
            const userExistence = await knex('usuarios').where({ email }).first();
            if (userExistence) return res.status(400).json('O email já existe')
        }

        const criptoPassword = await bcrypt.hash(senha, 10);

        const atualizacao = {
            nome,
            email,
            senha: criptoPassword,
            nome_loja
        };

        const updatedUser = await knex('usuarios')
            .where({ id: req.usuario.id })
            .update(atualizacao)
            .returning(['nome', 'email', 'nome_loja']);

        if (!updatedUser) return res.status(400).json('O usuário não foi atualizado');

        return res.status(200).json({ mensagem: "Usuário Alterado com Sucesso!" });
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}