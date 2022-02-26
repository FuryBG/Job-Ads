const { Schema, model } = require("mongoose");

const schema = new Schema({
    head: {type: String, required: true},
    location: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    subscribed: [{type: Schema.Types.ObjectId, ref: "User"}]
});


module.exports = model("Ad", schema);