const express = require("express");
const router = express.Router();
const user = require("../models/usersSchema");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const serviceSid = require("../twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);

dotenv.config({ path: "../DB/config.env" });

router.post("/loginwithotp", async (req, res) => {
  const sid = await serviceSid;

  try {
    const mobileNo = req.body.mobileNo;

    if (!mobileNo) {
      return res
        .status(422)
        .json({ status: false, message: "please enter your number" });
    }

    const findUserPhone = await user.findOne({ mobileNo: mobileNo });
    if (!findUserPhone) {
      return res.status(422).json({
        status: false,
        message: "user doesn't exist please register first",
      });
    } else {
      const response = twilioClient.verify.v2
        .services(sid)
        .verifications.create({ to: `+91${mobileNo}`, channel: "sms" })
        .then((verification) => console.log(verification));

      if (response) {
        return res
          .status(201)
          .json({
            status: true,
            message: "OTP send successfully to registered number",
          });
      }
    }
  } catch (error) {
    return res.status(422).json({
      status: false,
      message: "OTP could't process or something went wrong",
    });
  }
});

router.post("/verifyphoneotp", async (req, res) => {
  const sid = await serviceSid;
  console.log(sid);

  try {
    const { mobileNo, OTP } = req.body;

    const phoneUser = await user.findOne({ mobileNo: mobileNo });

    if (!mobileNo || !OTP) {
      return res
        .status(422)
        .json({ status: false, message: "phone or otp doesn't exists" });
    }

    if (typeof OTP != "number") {
      return res
        .status(422)
        .json({ status: false, message: "invalid form of otp" });
    }

    const response = await twilioClient.verify.v2
      .services(sid)
      .verificationChecks.create({ to: `+91${mobileNo}`, code: OTP });

    if (response.status === "approved") {
      const token = jwt.sign(
        { user_id: phoneUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });

      return res
        .status(201)
        .json({ status: true, message: "user successful logged In" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "something went wrong" });
  }
});

module.exports = router;
