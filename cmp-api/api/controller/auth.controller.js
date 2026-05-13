import { getToken } from "../../utl/gettoken.js";
import { Auth } from "../models/authschema.js";
import { College } from "../models/college.schema.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, college, isVerified, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    const isuserExist = await Auth.findOne({ email }); // findOne gives object and find usedin array (empty array )  gives true value
    if (isuserExist) {
      return res.status(400).json({
        message: "user already exist",
      });
    }
    const user = await Auth.create({
      username,
      email,
      password,
      college,
      isVerified,
      role,
    });

    return res.status(201).json({
      id: user._id,
      message: "registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body; // data json toh lae kae aya and frontend chae  data in req.body
    console.log("SIGNIN BODY:", req.body);
    if (!email || !password) {
      return res.status(400).json({
        message: "all filed are required ",
      });
    }
    const user = await Auth.findOne({ email }); // checking  email exist or not

    if (!user) {
      return res.status(500).json({
        message: "user not exist  ",
      });
    }

    const isMatch = await user.comparePassword(password); // user kae pass abbb email ,password bhi hai

    if (!isMatch) {
      return res.status(400).json({
        message: "password is incorrect ",
      });
    }
    console.log("password", isMatch);

    // check verified ?

    if (user.isVerified === false) {
      return res.status(400).json({
        message: "you can sign in once the admin has verified you",
      });
    }
    const token = await getToken(
      user._id,
      user.role,
      user.college ? user.college : null,
    );

    // “User ke college info ko token me bhi store karo
    if (!token) {
      return res.status(400).json({
        message: "token is not found",
      });
    }
    console.log("USER:", user);
    console.log("IS VERIFIED:", user?.isVerified);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "sigin succesfully ",
      });
  } catch (err) {
    res.status(500).json({ meassage: err.message });
  }
};

// get all users
export const getAllusers = async (req, res, next) => {
  try {
    console.log(req.user.id, "test");
    const college = await College.findOne({ admin: req.user.id });
    console.log(college);
    const users = await Auth.find({
      role: "user",
      college: college._id,
    }).select("-password");
    if (!users & (users.length === 0)) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//verfied
export const isVerifiedUser = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const updated_user = await Auth.findByIdAndUpdate(
      req.params.id,
      { $set: { isVerified: true } },
      {
        new: true,
      },
    );
    return res.json({
      message: "user verfied sucessfully ",
      data: updated_user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "you are not verified ",
    });
  }
};

// getuser

export const getUser = async (req, res, next) => {
  try {
    const user = await Auth.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "user not found",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      message: err.meassage,
    });
  }
};
