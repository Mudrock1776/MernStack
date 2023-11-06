const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors")

require("dotenv").config({ path: "./config.env"});
const PORT = process.env.PORT || 5000;

const Db = require("./Dbconn");

app.use(cors());

app.use(express.json());

app.use(require("./routes/contacts"));

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server is runing on port: ${PORT}`);
})