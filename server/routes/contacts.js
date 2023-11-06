const express = require('express');

const Routes = express.Router();
const CRUD = require("../../controllers/crud");

Routes.route("/contact/add").post((req,res) => {
    CRUD.createContact(req,res);
});

Routes.route("/contact").post((req, res) => {
    CRUD.list(req,res);
});

Routes.route("/contact/:id").get((req, res) => {
    CRUD.find(req,res);
});

Routes.route("/contact/delete").post((req,res) => {
    CRUD.delete(req,res);
});

Routes.route("/contact/update/:id").post((req, res) => {
    CRUD.update(req,res);
});

Routes.route("/user/login").post((req,res) => {
    CRUD.login(req,res);
});

Routes.route("/user/create").post((req,res) => {
    CRUD.createUser(req, res);
});

module.exports = Routes;