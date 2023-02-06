const express = require("express");
const mongoose = require("mongoose");

const addListingSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Category: [
    {
      type: String,
      required: true,
    },
  ],
  Rate: {
    TwoD_Design: {
      Rate: { type: Number, default: 0 },
      GST: { type: Number, default: 0 },
    },

    ThreeD_Design: {
      Rate: { type: Number, default: 0 },
      GST: { type: Number, default: 0 },
    },

    Interior_Design: {
      Rate: { type: Number, default: 0 },
      GST: { type: Number, default: 0 },
    },

    Site_Engineer: {
      Rate: { type: Number, default: 0 },
      GST: { type: Number, default: 0 },
    },
  },

  Address: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  Pincode: {
    type: Number,
    required: true,
  },
  Latitude: {
    type: Number,
    required: true,
  },
  Longitude: {
    type: Number,
    required: true,
  },
  Mobile: {
    type: Number,
    required: true,
  },
  AlternateMobile: {
    type: Number,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  GST: {
    type: Number,
    required: true,
  },
  ProfileImage: {
    type: Object,
    required: true,
  },
  WorkImage: [
    {
      type: Object,
      required: true,
    },
  ],
});

const addlisting = mongoose.model("Addlistings", addListingSchema);

module.exports = addlisting;
