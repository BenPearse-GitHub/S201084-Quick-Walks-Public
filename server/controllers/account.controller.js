const User = require("../models/user.model");
const accountService = require("../services/account.service");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");

// user signup method
async function signUp(req, res) {
  const { username, email, password } = req.body;

  // check username is valid
  if (!username || username.length == 0) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  //   email validation
  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      success: false,
      message: "Email is not valid",
    });
  }

  const passwordCheckResult = accountService.checkPassword(password);

  // password validation
  if (!passwordCheckResult.success) {
    return res.status(400).json(passwordCheckResult);
  }

  // create new user object and save to database
  const newUser = new User();
  // bind user data to new user
  newUser.username = username;
  newUser.email = email;
  newUser.password = newUser.generateHash(password);
  try {
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (e) {
    return res.status(400).json({
      message: "Unable to create new user",
      error: e,
    });
  }
}

// user signin method
async function signIn(req, res) {
  const { email, password } = req.body;
  let userResult;
  // find user by email
  try {
    userResult = await User.findOne({ email });
  } catch (e) {
    return res.status(400).json({
      message: "Error fetching user",
      error: e,
    });
  }
  // If valid user is found
  if (
    userResult &&
    userResult.validPassword(password) &&
    !userResult.isDeleted
  ) {
    // Create new jwt token
    const token = jwt.sign(
      {
        _id: userResult._id.toString(),
        username: userResult.username,
        email: userResult.email,
      },
      process.env.JWT_SECRET.toString()
    );
    // Sent token to client
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }
}

module.exports = {
  signUp,
  signIn,
};
