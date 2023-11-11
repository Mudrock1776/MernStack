const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//workstation model, user will not be visable on site
const workstation = new Schema({
    user: {type: String, required: true},
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    hours: {type: Number, required: true},
    availability: {type: Number},
    capacity: {type: [Number]}
},{
    timestamps: true
});

module.exports = mongoose.model("workstation", workstation);