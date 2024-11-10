const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

const daoController = require("../controllers/dao");

//Middlewares
const unsureAuthenticated = require("../middlewares/unsureAuthenticated");

router.post(
    "/create", 
    [body("address", "Descrição é necessário").exists({ checkFalsy: true })], 
    [body("authorId", "Author é necessário").exists({ checkFalsy: true })],
    [body("title", "Title é necessário").exists({ checkFalsy: true })],
    [body("description", "Desc é necessário").exists({ checkFalsy: true })], 
    [body("prLink", "PR é necessário").exists({ checkFalsy: true })], 
    [body("options", "OP é necessário").exists({ checkFalsy: true })], 
    [body("open", "OPEN é necessário").exists({ checkFalsy: false })],
    [body("totalVotes", "Total é necessário").exists({ checkFalsy: false })],
    [body("executed", "Exec é necessário").exists({ checkFalsy: false })], 
    unsureAuthenticated.unsureAuthenticated,
    daoController.Create
);

router.get(
    "/getAll",
    unsureAuthenticated.unsureAuthenticated,
    daoController.getAll
);

router.get(
    "/getById/:id",
    [param("id", "ID é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    daoController.getById
);

router.get(
    "/getByUser/:address",
    [param("address", "ID é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    daoController.getByAddress
)

router.delete(
    "/delete/:id",
    [param("id", "ID é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    daoController.deleteById
)

router.get(
    "/closeProposal/:id",
    [param("id", "ID é necessário").exists({ checkFalsy: true })],
    unsureAuthenticated.unsureAuthenticated,
    daoController.closeProposal
)

//Exporta o ROUTER
module.exports = router;
