const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const user = require("../models/usersSchema");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "../DB/config.env" });

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({
          status: false,
          message: "please filled all the required field",
        });
    }
    const userExist = await user.findOne({ email: email });

    if (!userExist) {
      return res
        .status(422)
        .json({
          status: false,
          message: "user doesn't exist please register first",
        });
    }

    const verifyPassword = bcrypt.compareSync(password, userExist.password);

    if (userExist.email === email && verifyPassword === true) {
      const token = jwt.sign(
        { user_id: userExist._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        // secure: true,
      });

      return res
        .status(201)
        .json({ status: true, message: "user successfull logged In" });
    } else {
      throw new Error("credential not matched");
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "Invalid credential", error });
  }
});

module.exports = router;
