const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//part structure only name and months will be visable, Month requires an Array
const part = new Schema({
    user: {type: String, required: true},
    name: {type: String, required: true},
    months: {type: [Number], required: true}
},{
    timestamps: true
});

module.exports = mongoose.model("part", part);
