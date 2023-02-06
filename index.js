const express = require("express");
const connectDB = require("./DB/connectDB");
const dotenv = require("dotenv");
const addlisting = require("./Routes/addlisting");
const listing = require("./Routes/listing");
const register = require("./Routes/register");
const login = require("./Routes/login");
const loginwithotp = require("./Routes/loginwithotp");
const forgottenpassword = require("./Routes/forgottenpassword")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addlisting);
app.use(listing);
app.use(register);
app.use(login);
app.use(loginwithotp);
app.use(forgottenpassword)

dotenv.config({ path: "./DB/config.env" });

const port = process.env.PORT;

app.listen(3000, (req, res) => {
  console.log(`connection to server is successfull to port ${port}`);
});

connectDB()
  .then((result) => {
    console.log("Connection to database is successfull");
  })
  .catch((err) => {
    console.log(err);
  });
