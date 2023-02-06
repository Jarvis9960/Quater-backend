const express = require("express");
const router = express.Router();
const user = require("../models/usersSchema");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const randomString = require("randomstring");
const bcrypt = require("bcrypt");

dotenv.config({ path: "../DB/config.env" });

router.post("/forgottenpassword", async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      res.status(422).json({ message: "please provide email" });
    }

    const existingUser = await user.findOne({ email: email });

    if (!existingUser) {
      res
        .status(422)
        .json({ message: "user doesn't exist please register first" });
    } else {
      const randomStringToken = randomString.generate();

      const response = await user.updateOne(
        { email: email },
        { $set: { forgotPassToken: randomStringToken } },
        { new: true }
      );

      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "jarvis9960@gmail.com",
          pass: "msauwpetmsubwflq",
        },
      });

      let info = await transporter.sendMail({
        from: "jarvis9960@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Reset-Password", // Subject line
        // text: "Here is the link to reset you password", // plain text body
        html: `<p>Hello, You  requested to change your password in Quater. Here is the link for resetting your password</P>. <a href='https://localhttp://localhost:3000/resetpassword/${randomStringToken}'>Reset your password</a>`, // html body
      });

      if (info.accepted[0] === email && response.acknowledged === true) {
        return res
          .status(200)
          .json({ status: true, Messgae: "email successfully sent to gmail" });
      } else {
        throw new Error("something went wrong");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(442).json({
      status: false,
      Message: "something went wrong we couldn't process the reset link",
    });
  }
});

router.patch("/resetpassword/:token", async (req, res) => {
  try {
    const resetPassToken = req.params.token;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (!resetPassToken) {
      return res.status(422).json({
        status: false,
        Message:
          "Token is not provided generate new link for resetting password",
      });
    }

    if (!password || !cpassword) {
      return res.status(422).json({
        status: false,
        Message: "Please provide password and comfirm password field",
      });
    }

    const UserWhoWantPassChange = await user.findOne({
      forgotPassToken: resetPassToken,
    });

    if (!UserWhoWantPassChange) {
      return res.status(422).json({
        Status: false,
        Message: "Token is expired Please generate your reset link again",
      });
    } else {
      if (password !== cpassword) {
        return res.status(422).json({
          Status: false,
          Message:
            "password and confirm password are not matching please check it again",
        });
      }

      const verifyPassword = bcrypt.compareSync(
        password,
        UserWhoWantPassChange.password
      );

      if (verifyPassword) {
        return res.status(422).json({
          status: false,
          Message: "password is same as your old password",
        });
      }

      let plainTextPassword = password;

      const salt = await bcrypt.genSaltSync(10);

      const securePassword = await bcrypt.hashSync(plainTextPassword, salt);

      const changesPassword = await user.updateOne(
        { forgotPassToken: resetPassToken },
        { $set: { password: securePassword, forgotPassToken: "" } }
      );

      if (changesPassword.acknowledged === true) {
        return res
          .status(200)
          .json({ status: true, Message: "Password changes succesfully" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: false,
      Message: "something went wrong please reset your password again",
    });
  }
});

module.exports = router;
