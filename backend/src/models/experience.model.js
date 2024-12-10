const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    imgUrl: {
      type: String,
      default:
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjezYpJV2p_XG4kFKaecP6xVSma_bBTw2Usn6Ch_Gqka5uB-LuExrWzK1ZYMM8-aqUCu4&usqp=CAU" },
  });

  const experienceSchema= new Schema({
    yearOfExp:{
        type:Number,
        required:true,
    },
    profileImg:[imageSchema],
  })


  experienceSchema.pre("save", function (next) {
    // Apply the default URL if imgUrl is empty
    this.profileImg.forEach((img) => {
      if (!img.imgUrl) {
        img.imgUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjezYpJV2p_XG4kFKaecP6xVSma_bBTw2Usn6Ch_Gqka5uB-LuExrWzK1ZYMM8-aqUCu4&usqp=CAU"
    }
    });
    next();
  });

module.exports = mongoose.model("Experience", experienceSchema);