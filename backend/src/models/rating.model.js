const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Customer=require("./customer.model.js");


const ratingSchema=new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,},
    comment: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        // required: true,
    },

},{
    timeStamps:true,
})

module.exports = mongoose.model("Rating", ratingSchema);