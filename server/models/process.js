const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//process scheme, uses user and part to identify itself
const process = new Schema({
    user: {type: String, required: true},
    part: {type: String, required: true},
    name: {type: String, required: true},
    workstation: {type: String, required: true},
    MT: {type: Number, required: true},
    BS: {type: Number, required: true},
    RTY: {type: Number, required: true}
},{
    timestamps: true
});

module.exports = mongoose.model("process", process);