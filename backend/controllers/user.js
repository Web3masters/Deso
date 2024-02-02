const { validationResult } = require('express-validator')
require('express-async-errors')
const jwt = require('jsonwebtoken')

const service = require('../services/user')

const User = new service.User()

const Create = async (req, res) => {
    const { email, password, name, address, username, imgAddress } = req.body

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
        const result = await User.Create(email, password, name, address, username, imgAddress)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const Verify = async (req, res) => {
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
        const result = await User.verifyAccount(address)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const Auth = async (req, res) => {
    const { address, password } = req.body

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
        const result = await User.Authenticate(address, password)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const Update = async (req, res) => {
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
        const result = await User.update(id, req.body)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const Delete = async (req, res) => {
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
        const result = await User.delete(id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const GetUser = async (req, res) => {
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
        const result = await User.getUser(id, req.id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const GetUserCalling = async (req, res) => {
    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await User.getUser(req.id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getAll = async (req, res) => {
    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await User.getAllUsers()
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const updateImage = async (req, res) => {
    const { imgUrl } = req.body

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
        const result = await User.updateImage(req.body, imgUrl)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const follow = async (req, res) => {
    const { id } = req.params

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
    }

    try {
        const result = await User.followUser(req.id, id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const unfollow = async (req, res) => {
    const { id } = req.params

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
        })
    }

    try {
        const result = await User.unfollowUser(req.id, id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    Create,
    Auth,
    Verify,
    Update,
    Delete,
    GetUser,
    GetUserCalling,
    getAll,
    updateImage,
    follow,
    unfollow,
}
