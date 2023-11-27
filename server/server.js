const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env"});
const PORT = process.env.PORT || 80;

//Creates Database connection
const Db = require("./DBconn");

app.use(cors());

app.use(express.json());

//Routes
app.use(require("./routes/user"))
app.use(require("./routes/capacity"));

//makes our deafault path the production build of the react-app so we can run everything under one port
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

//Starts server listening
app.listen(PORT, ()=> {
    console.log(`Server is running on port: ${PORT}`);
});