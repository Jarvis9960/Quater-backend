const express = require("express");
const router = express.Router();
const addlisting = require("../models/addlistingschema");

router.get("/listing", async (req, res) => {
  try {
    const listingData = await addlisting.find();

    if (listingData) {
      return res.status(201).send(listingData);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Message: "something went wrong" });
  }
});

// router.patch("/listing/subscription/update/:_id", async (req, res) => {
//   const subcriptionUser = req.params._id;

//   const response = await addlisting.updateOne(
//     { _id: subcriptionUser },
//     { $set: { isSubscribed: true } }
//   );

  
  

//   // aggregate([
//   //   {
//   //     $addFields: {
//   //       startsWithKey: {
//   //         $eq: [
//   //           {
//   //             $indexOfBytes: ["$key", "recommended"],
//   //           },
//   //           0,
//   //         ],
//   //       },
//   //     },
//   //   },
//   //   {
//   //     $sort: {
//   //       startsWithKey: -1,
//   //     },
//   //   },
//   // ]);

 
// });

module.exports = router;
