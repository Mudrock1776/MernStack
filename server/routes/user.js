const express = require("express");

const Routes = express.Router();
const user = require("../controllers/user");

//User Routes
/*Creates a new user, takens in a post request with a body like so:
{
    username: <name of new user>,
    password: <password for user>
}
on a successful creation creation it will send a response with a status of 200
and the response will contain the user's id within the token section of the response
on Failure the response will have the status 406 and will send "Username Taken" in the token section
a 400 status is a server error */
Routes.route("/user/create").post((req,res) => {
    user.createUser(req,res);
});

/*Verifies that a user exists with the given username and password, takes in a body like
{
    username: <username>,
    password: <password>
}
on successful login it will send a response with status 200, and the user's id under token
on failure it will send a response with status 406, and the token will equal "Improper credentials"
a response with a status 400 is a server error */
Routes.route("/user/login").post((req,res) => {
    user.login(req,res);
});

module.exports = Routes;