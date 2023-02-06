const express = require("express");
const router = express.Router();
const user = require("../models/usersSchema");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, mobileNo, email, password, cpassword } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !mobileNo ||
      !email ||
      !password ||
      !cpassword
    ) {
      return res
        .status(422)
        .json({ status: false, message: "please enter all field" });
    }
    const userEmailExist = await user.findOne({ email: email });
    const userPhoneExist = await user.findOne({ mobileNo: mobileNo });

    if (userEmailExist || userPhoneExist) {
      return res
        .status(422)
        .json({ status: false, message: "user already exist" });
    } else if (password !== cpassword) {
      return res
        .status(422)
        .json({
          status: false,
          message: "password and confirm password isn't matching",
        });
    } else {
      let plainTextPassword = password;

      const salt = await bcrypt.genSaltSync(10);

      const securePassword = await bcrypt.hashSync(plainTextPassword, salt);

      const newUser = new user({
        firstName: firstName,
        lastName: lastName,
        mobileNo: mobileNo,
        email: email,
        password: securePassword,
        cpassword: securePassword,
      });

      var response = await newUser.save();
    }

    if (response) {
      return res
        .status(201)
        .json({ status: true, message: "user registered succefully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong" });
  }
});

module.exports = router;
