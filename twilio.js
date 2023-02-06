const dotenv = require("dotenv");
dotenv.config({ path: "./DB/config.env" });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const serviceSid = client.verify.v2.services
  .create({ friendlyName: "QT-VERIFY" })
  .then((service) => {
    return service.sid;
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = serviceSid;
