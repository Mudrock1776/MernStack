const user = require("../models/user");
const contact = require("../models/contact");

exports.createUser = async (req, res) => {
    console.log(req.body);
    var newUser = new user(req.body);
    if (await user.exists({username: newUser.username})){
        console.log("username taken")
        res.send({
            token: "Username Taken"
        });
    } else {
        try {
            await newUser.save();
            res.send({
                token: req.body.username
            });
            //res.redirect("/main");
        } catch(err){
            console.log(err);
            res.status(400).send("Unable to register user");
        }
    }
};

exports.login = async (req, res) => {
    console.log(req.body);
    if (await user.exists({username: req.body.username, password: req.body.password})){
        res.send({
            token: req.body.username
        });
        //res.redirect("/main");
    } else {
        console.log("improper Credentials");
        res.send({
            token: "Improper credentials"
        });
    }
}

exports.createContact = async (req, res) => {
    console.log(req.body);
    var newContact = new contact(req.body);
    try {
        await newContact.save();
        res.redirect("/main");
    } catch(err){
        console.log(err);
        res.status(400).send("Unable to create contact");
    }
};

exports.list = async (req, res) => {
    try {
        console.log(req.body.user);
        var contacts = await contact.find({user: req.body.user});
        res.json(contacts);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

exports.find = async (req, res) => {
    try{
        var Contact = await contact.findById(req.params.id);
        res.json(Contact);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

exports.update = async (req,res) => {
    try{
        await contact.findByIdAndUpdate(req.params.id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phonenumber: req.body.phonenumber
        });
        res.redirect("/main");
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

exports.delete = async (req, res) => {
    console.log(req.body)
    try {
        await contact.findByIdAndDelete(req.body.id);
        var contacts = await contact.find({});
        res.json(contacts);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}