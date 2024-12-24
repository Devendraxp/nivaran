import { Customer } from "../models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Generate JWT Tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const customer = await Customer.findById(userId);
    const accessToken = customer.generateAccessToken();
    const refreshToken = customer.generateRefreshToken();
    customer.refreshToken = refreshToken;
    await customer.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error || "Something went wrong!");
  }
};

// Register Customer
 const registerCustomer = asyncHandler(async (req, res) => {
  const { username, email, name, password } = req.body;

  if ([name, username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All * fields are required");
  }

  const existedCustomer = await Customer.findOne({
    $or: [{ email }, { username }],
  });

  if (existedCustomer) {
    throw new ApiError(409, "Customer with this email or username exists");
  }

  const profileImgLocalPath = req.files?.profileImg[0]?.path;

  if (!profileImgLocalPath) {
    throw new ApiError(400, "Profile picture is required");
  }

  const profileImg = await uploadOnCloudinary(profileImgLocalPath);
  if (!profileImg) {
    throw new ApiError(400, "Profile image upload failed");
  }

  const customer = await Customer.create({
    name,
    username,
    email,
    password,
    profileImage: [{ filename: req.files?.profileImg[0]?.originalname, imgUrl: profileImg.url }]
  });

  const createdCustomer = await Customer.findById(customer._id).select("-refreshToken -password"); 
  if (!createdCustomer) {
    throw new ApiError(500, "Something went wrong while registering the customer");
  }

  res.status(201).json(
    new ApiResponse(200, createdCustomer, "Customer registered successfully!")
  );
});


//login route 
const loginCustomer=asyncHandler(async(req,res)=>{
  const {username,password}=req.body;

  if(!username || !password){
    throw new ApiError(400,"username or email and password is required to login");
  }

  const customer = await Customer.findOne({
    $or: [{ email: username }, { username: username }],
  })

  if(!customer)
  {
    throw new ApiError(404,"customer not found");
  }

  const isLogin=customer.isPasswordCorrect(password);
  if(!isLogin)
  {
    throw new ApiError(401, "Invalid credentials");
  }
  
  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(
    customer._id,
  )

  const customerData = await Customer.findById(Customer._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, { customer: customerData }, "customer login successfully"),
    );

})

// logout route


const logoutCustomer = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(400, "Unauthorized access");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refreshToken", "", options)
    .cookie("accessToken", "", options)
    .json(new ApiResponse(200, "", "Logout successfully !!"));
});


// profile

const getCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer._id).select(
    "-password -refreshToken",
  );

  if (!customer) {
    throw new ApiError(404, "customer not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, customer, "customer profile fetched successfully"));
});


// profile update

const updateProfile=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const updatedData=req.body;
    const updatedProfile=await Customer.findByIdAndUpdate(id,updatedData,{new:true,runValidators:true});

    if(!updatedProfile){
      throw new ApiError(404, "customer not found");
    }
    res.status(200)
    .json(new ApiResponse(200, updatedProfile, "customer profile updated successfully")); 
})

//password update
 
const updatePassword=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  const {oldPassword,newPassword}=req.body;

  if(!oldPassword || !newPassword)
  {
    throw new ApiError(404, "old and new password both are required");
  }
  
  const customer=await Customer.findById(id);
  if(!customer){
    throw new ApiError(404, "customer not found");
  }

  const checkPassword= await  customer.isPasswordCorrect(oldPassword);

  if(!checkPassword)
  {
    throw new ApiError(401, "Wrong Original Password");
  }

  customer.password=newPassword;
  await customer.save();

  res.status(200)
  .json(new ApiResponse(200, '', "customer password updated successfully")); 


})

//profile picture update

const UpdateprofilePic = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const profileImgLocalPath = req.files?.profileImg?.[0]?.path;

  if (!profileImgLocalPath) {
      throw new ApiError(400, "Profile picture is required. Ensure the file is uploaded using the 'profileImg' field.");
  }

  const profileImg = await uploadOnCloudinary(profileImgLocalPath);
  if (!profileImg) {
      throw new ApiError(400, "Profile image upload failed");
  }

  const updatedProfileImg = await Customer.findByIdAndUpdate(
      id,
      {
          profileImage: {
              filename: req.files.profileImg[0].originalname,
              imgUrl: profileImg.url,
          },
      },
      { new: true, runValidators: true }
  );

  if (!updatedProfileImg) {
      throw new ApiError(404, "Customer not found");
  }

  res.status(200).json(
      new ApiResponse(200, updatedProfileImg, "Profile image updated successfully")
  );
});


 export {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerProfile,
  updateProfile,
  updatePassword,
  UpdateprofilePic,
}