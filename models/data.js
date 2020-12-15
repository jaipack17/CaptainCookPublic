const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    bal: Number,
    lastclaim: Number,
    goldenknife: Number,
    rank: String,
    salary: Number,
    worked: Number,
    failed: Number,
    wellingtons: Number,
    salmons: Number,
    steaks: Number,
    scallops: Number,
    risottos: Number,
    pizzas: Number,
    burgers: Number,
    chickendinners: Number
});

module.exports = mongoose.model("Data", dataSchema);