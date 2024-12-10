const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Rating=require("./rating.model.js");
const Customer=require("./customer.model.js");
const Experience=require("./experience.model.js")


const imageSchema = new Schema({
    filename: String,
    imgUrl: {
      type: String,
      default:
"https://img.freepik.com/premium-vector/illustration-modern-construction-working-man-laptop-use-cartoon-vector-white-background_734841-247.jpg?semt=ais_hybrid"   
 },
  });

const workerSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
        index: true,
    },
    name:{
    type:String,
    required:true,
    index:true,
    trim: true,
    },
    email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim: true,
},
phone_no:{
    type:Number,
    required:true,
},
address:{
    flat_No:{
        type:[String],
        required:true,
    },
    town:{
        type:string,
        required:true,
    },
    city:{
        type:string,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    pincode:{
    type:Number,
    required:true,
    },

},
worker_pimg:[imageSchema],
working_hours:{
    type:Number,
    required:true,
},
description:{
    type:String,
    required:true,
},
language:{
    type:[String],
    required:true,
},
services:{
    type:[String],
    required:true,
},
rating:[
    {
        type: Schema.Types.ObjectId,
        ref: "Rating",
    }
],
experience:{
    type:Schema.Types.ObjectId,
    ref: "Experience",
},
password:{
    type:String,
    required:true,
},
refreshToken:{
    type:String,
}


})

workerSchema.pre("save", function (next) {
    // Apply the default URL if imgUrl is empty
    this.worker_pimg.forEach((img) => {
      if (!img.imgUrl) {
        img.imgUrl =
"https://img.freepik.com/premium-vector/illustration-modern-construction-working-man-laptop-use-cartoon-vector-white-background_734841-247.jpg?semt=ais_hybrid"      }
    });
    next();
  });

const worker=mongoose.model("worker",workerSchema);
module.exports=worker;