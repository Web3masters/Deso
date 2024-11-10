const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const unsureAuthenticated = (req, res, next) => {
    //Recebe o token inserido pela aplicação
    const authToken = req.headers.authorization;

    //Valida se o token está preenchido
    if (!authToken) {
        res.status(401).json({
            message: "UNAUTHORIZED",
            code: 401
        })
        return
    }

    //Desestrutura o header "Bearer 'token'"
    [, token] = authToken.split(" ")

    //Valida se o token é válido
    try {
        //Verifica o Token
        const { id } = jwt.verify(token, process.env.TOKEN_USER_AUTH)

        //Recupera infos do usuário
        req.id = id
        return next();
    } catch(err) {
        //Retorna o erro caso o token não seja válido
        res.status(401).json({
            message: "UNAUTHORIZED",
            code: 401
        })
        return
    }
}


//Exporta como um MIDDLEWARE
module.exports = {
    unsureAuthenticated
}