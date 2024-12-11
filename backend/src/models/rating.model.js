import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { Customer } from "./customer.model.js";


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

export const Rating = mongoose.model("Rating", ratingSchema);