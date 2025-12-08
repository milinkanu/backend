import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { upload } from "../middlewares/multer.middleware.js"
import { uploadOnCloudiary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend

    const { fullname, email, username, password } = req.body
    console.log("email: ", email);
    // validation - not empty
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // check if user already exits: username, email
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }
    // check for images, check for avatar
    const avatarLoacalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLoacalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    // upload them to clodinary, avatar

    const avatar = await uploadOnCloudiary(avatarLoacalPath)
    const coverImage = await uploadOnCloudiary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    // create user object - create entry in db

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and refresh token field from respose
    const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken" //yeh dono field select hokar nahi aayegi
    )
    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Sucessfully!")
    );
})

export { registerUser }