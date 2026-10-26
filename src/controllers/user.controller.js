import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/todos/user.models.js"; // this User direct connect with db using mongoose
import { fileUploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  const dbUser = await User.findById(userId);
  const accessToken = dbUser.generateAccessToken();
  const refreshToken = dbUser.generateRefreshToken();

  dbUser.refreshToken = refreshToken;
  await dbUser.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const registerUser = asyncHandler(async (req, res) => {
  // steps
  // 1 get details from frontend
  // 2 validations
  // 3 check if user already exists (using email and mobile number)
  // 4 check for profile image and upload on cloudinary
  // 5 create user object - create entry in db
  // 6 remove password  and refresh token field from response
  // 7 check for user creation
  // 8 return response

  const { firstname, lastname, email, mobNumber, password } = req.body;

  if (
    [firstname, lastname, email, mobNumber, password].some(
      (field) => field?.trim() == ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { mobNumber }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or number already exists");
  }

  const avatarLocalPath = req?.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required...");
  }

  const avatar = await fileUploadOnCloudinary(avatarLocalPath);
  const coverImage = await fileUploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    mobNumber,
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
    password,
    role: req.body.role || "user",
  });

  const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .lean();
  // here we verified user is created or not in db and we remove password, refreshToken field
  // in select method default select all fields and use "-" sign for fields which we do not send on frontend side

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body => data
  // email or number
  // find use in db
  // password check
  // access token and refresh token
  // send cookie
  const { email, mobNumber, password } = req.body;

  if (!email && !mobNumber) {
    throw new ApiError(400, "Email or Number is required....");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { mobNumber }],
  });

  if (!existedUser) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await existedUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existedUser._id
  );

  const loggedInUser = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User Logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incommingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incommingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedRefreshToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired on used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Unauthorized request");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
