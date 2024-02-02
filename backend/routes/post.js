const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

const postController = require("../controllers/post");

//Middlewares
const unsureAuthenticated = require("../middlewares/unsureAuthenticated");

router.post(
    "/create", 
    [body("description", "Descrição é necessário").exists({ checkFalsy: true })], 
    [body("createNft", "createNFT é necessário").exists({ checkFalsy: false })], 
    unsureAuthenticated.unsureAuthenticated,
    postController.Create
);

router.get(
    "/getAll",
    unsureAuthenticated.unsureAuthenticated,
    postController.GetAll
);

router.get(
    "/getById/:id",
    [param("id", "ID é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    postController.GetPostById
);

router.get(
    "/getByUser/:id",
    unsureAuthenticated.unsureAuthenticated,
    postController.GetPostByAuthorId
)

router.delete(
    "/delete/:id",
    [param("id", "ID é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    postController.DeletePostById
)

router.post(
    "/createComment",
    [body("idPost", "ID do Post é necessário").exists({ checkFalsy: true })],
    [body("text", "Texto do comentário é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    postController.createComment
)

router.delete(
    "/deleteComment/:id",
    [param("id", "ID é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    postController.deleteComment
)

router.post(
    "/deleteCommentSpec",
    [param("idPost", "ID do Post é necessário").exists({ checkFalsy: true })],
    [param("idUser", "ID do usuário é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    postController.deleteCommentSpecific
)

router.get(
    "/like/:idPost",
    [param("idPost", "ID do Post é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    postController.likePost
)

router.get(
    "/dislike/:idPost",
    [param("idPost", "ID do Post é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    postController.dislikePost
)



//Exporta o ROUTER
module.exports = router;
