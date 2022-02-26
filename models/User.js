const { Schema, model } = require("mongoose");

const schema = new Schema({
    email: {type: String, required: true},
    hashedPassword: {type: String, required: true},
    skills: {type: String, required: true},
    ads: [{type: Schema.Types.ObjectId, ref: "Ads"}]
});

module.exports = model("User", schema);