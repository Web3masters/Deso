const { validationResult } = require('express-validator')
require('express-async-errors')
const jwt = require('jsonwebtoken')

const service = require('../services/dao')

const DAO = new service.DAO()

const Create = async (req, res) => {
    const { address, authorId, title, description, prLink, options, open, totalVotes, executed } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
    }

    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await DAO.Create(address, authorId, title, description, prLink, options, open, totalVotes, executed)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getAll = async (req, res) => {
    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await DAO.getAll()
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getById = async (req, res) => {
    const { id } = req.params

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
    }

    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await DAO.getById(id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getByAddress = async (req, res) => {
    const { address } = req.params

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
    }

    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await DAO.getByAddress(address)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
    }

    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await DAO.deleteById(id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const closeProposal = async (req, res) => {
    const { id } = req.params

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
    }

    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await DAO.closeProposal(id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    Create,
    getAll,
    getById,
    getByAddress,
    deleteById,
    closeProposal
}
