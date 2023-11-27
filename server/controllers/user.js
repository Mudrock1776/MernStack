const user = require("../models/user");

exports.createUser = async (req,res) => {
    var newUser = new user(req.body);
    if (await user.exists({username: newUser.username})){
        res.status(406).send({
            token: "Username Taken"
        });
    } else if (await user.exists({email: newUser.email})){
        res.status(409).send({
            token: "Email Taken"
        });
    } else if (!newUser.email || !newUser.username || !newUser.password){
        res.status(400).send({
            token: "All fields are required"
        });
    } else {
        try {
            await newUser.save();
            savedUser = await user.findOne({username:newUser.username})
            res.status(200).send({
                token: savedUser._id
            });
            //res.redirect("/main");
        } catch(err){
            console.log(err);
            res.status(400).send(err);
        }
    }
}

exports.login = async (req, res) => {
    try {
        var id = await user.exists({username: req.body.username, password: req.body.password});
        if (id != null){
            res.send({
                token: id._id
            });
            //res.redirect("/main");
        } else {
            res.status(406).send({
                token: "Improper credentials"
            });
        }
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}
