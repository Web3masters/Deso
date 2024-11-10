const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

const userController = require("../controllers/user");

//Middlewares
const unsureAuthenticated = require("../middlewares/unsureAuthenticated");

router.get(
        "/", 
        unsureAuthenticated.unsureAuthenticated, 
        userController.GetUserCalling
);

router.post
        ("/register", 
        [body("email", "Email é necessário").exists({ checkFalsy: true })], 
        [body("password", "Senha é necessária").exists({ checkFalsy: true })], 
        [body("name", "Nome é necessária").exists({ checkFalsy: true })], 
        [body("address", "Area é necessária").exists({ checkFalsy: true })], 
        [body("username", "UserName é necessário").exists({ checkFalsy: true })],
        [body("imgAddress", "URL da imagem é necessário").exists({ checkFalsy: true })],
        userController.Create
);

router.get(
        "/verify/:address",
        [param("address", "Endereço é necessário").exists({ checkFalsy: true })], 
        userController.Verify
);

router.post(
        "/auth", 
        [body("address", "Endereço é necessário").exists({ checkFalsy: true })], 
        [body("password", "Senha é necessária").exists({ checkFalsy: true })], 
        userController.Auth
);

router.put(
        "/update/:id", 
        [param("id", "ID é necessário").exists({ checkFalsy: true })],
        unsureAuthenticated.unsureAuthenticated, 
        userController.Update
);

router.get(
        "/getAll", 
        unsureAuthenticated.unsureAuthenticated, 
        userController.getAll
);

router.get(
        "/getById/:id",
        [param("id", "ID é necessário").exists({ checkFalsy: true })],
        unsureAuthenticated.unsureAuthenticated,
        userController.GetUser
);

router.put(
        "/updateImage",
        [body("imgUrl", "URL da imagem é necessário").exists({ checkFalsy: true })], 
        unsureAuthenticated.unsureAuthenticated, 
        userController.updateImage
);

router.get(
        "/follow/:id",
        [param("id", "ID to follow é necessário").exists({ checkFalsy: true })], 
        unsureAuthenticated.unsureAuthenticated, 
        userController.follow
);

router.get(
        "/unfollow/:id",
        [param("id", "ID to follow é necessário").exists({ checkFalsy: true })], 
        unsureAuthenticated.unsureAuthenticated, 
        userController.unfollow
);

//Exporta o ROUTER
module.exports = router;
