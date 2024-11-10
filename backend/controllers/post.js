const { validationResult } = require('express-validator')
require('express-async-errors')
const jwt = require('jsonwebtoken')

const service = require('../services/post')

const Post = new service.Post()

const Create = async (req, res) => {
    const description = req.body.description 
    const createNft = req.body.createNft || false
    const ipfsLink = req.body.ipfsLink || ""

    console.log(`criar nft? ${createNft}: ${ipfsLink}`)

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
        const result = await Post.Create(description, req.id, ipfsLink, createNft)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const GetAll = async (req, res) => {
    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await Post.GetPosts(req.id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const GetPostById = async (req, res) => {
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
        const result = await Post.GetPostById(id, req.id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const GetPostByAuthorId = async (req, res) => {
    //Chamada para o service
    try {
        //Tratamento das respostas do método da classe
        const result = await Post.GetPostsByAuthorId(req.id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const DeletePostById = async (req, res) => {
    const { id } = req.body

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
        const result = await Post.deletePost(id, req.id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const createComment = async (req, res) => {
    const { idPost, text } = req.body

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
        const result = await Post.addComment(idPost, req.id, text)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteComment = async (req, res) => {
    const { idComment } = req.params

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
        const result = await Post.deleteComment(idComment)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteCommentSpecific = async (req, res) => {
    const { idPost, idUser } = req.body

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
        const result = await Post.deleteCommenteEspecific(idPost, idUser)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const likePost = async (req, res) => {
    const { idPost } = req.params

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
        const result = await Post.likePost(idPost, req.id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const dislikePost = async (req, res) => {
    const { idPost } = req.params

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
        const result = await Post.unlikePost(idPost, req.id)
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    Create,
    GetAll,
    GetPostById,
    GetPostByAuthorId,
    DeletePostById,
    createComment,
    deleteComment,
    deleteCommentSpecific,
    likePost,
    dislikePost,
}
