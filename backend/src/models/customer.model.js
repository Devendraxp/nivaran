import mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    imgUrl: {
      type: String,
      default:
        "https://cdn.icon-icons.com/icons2/3230/PNG/512/user_person_customer_icon_196942.png",
    },
  });

const customerSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase:true,
        trim: true,
    },
    name:{
        type:String,
        required:true,
        index:true,
        trim: true,
    },
    profileImage:[imageSchema],
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    },
},{
    timeStamps:true,
});


customerSchema.pre("save", function (next) {
    // Apply the default URL if imgUrl is empty
    this.profileImage.forEach((img) => {
      if (!img.imgUrl) {
        img.imgUrl =
"   https://cdn.icon-icons.com/icons2/3230/PNG/512/user_person_customer_icon_196942.png"
      }
    });
    next();
  });

export const Customer = mongoose.model("Customer", customerSchema);