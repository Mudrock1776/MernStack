const mongoose = require("mongoose");
const url = process.env.MONGOURL;
const DB = mongoose.connect(url, {useNewUrlParser: true});