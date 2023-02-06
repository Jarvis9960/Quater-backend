const express = require("express");
const router = express.Router();
const addlisting = require("../models/addlistingschema");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!"); // custom this message to fit your needs
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const multipleUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "workimage", maxCount: 4 },
]);

router.post("/addlisting", multipleUpload, async function (req, res) {
  try {
    const {
      Title,
      Description,
      Category,
      Rate,
      Address,
      Country,
      State,
      City,
      Pincode,
      Latitude,
      Longitude,
      Mobile,
      AlternateMobile,
      Email,
      GST,
    } = req.body;
    console.log(
      Title,
      Description,
      Category,
      Rate,
      Address,
      Country,
      State,
      City,
      Pincode,
      Latitude,
      Longitude,
      Mobile,
      AlternateMobile,
      Email,
      GST
    );

    if (
      !Title ||
      !Description ||
      !Category ||
      !Rate ||
      !Address ||
      !Country ||
      !State ||
      !City ||
      !Pincode ||
      !Latitude ||
      !Longitude ||
      !Mobile ||
      !AlternateMobile ||
      !Email ||
      !GST
    ) {
      return res
        .status(422)
        .json({status: false, message: "please filled all the required field" });
    }

    const ProfileImage = req.files.image;

    const workImage = req.files.workimage;

    if (!ProfileImage || !workImage) {
      return res
        .status(422)
        .json({status: false, message: "please upload image and work samples" });
    }

    const newListing = new addlisting({
      Title: Title,
      Description: Description,
      Category: Category,
      Rate: Rate,
      Address: Address,
      Country: Country,
      State: State,
      City: City,
      Pincode: Pincode,
      Latitude: Latitude,
      Longitude: Longitude,
      Mobile: Mobile,
      AlternateMobile: AlternateMobile,
      Email: Email,
      GST: GST,
      ProfileImage: ProfileImage,
      WorkImage: workImage,
    });

    const response = await newListing.save();

    if (response) {
      return res
        .status(201)
        .json({ status: true, Message: "Listing added successfull" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", error });
  }
});

module.exports = router;
