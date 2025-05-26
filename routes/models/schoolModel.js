
const { Schema, model } = require("mongoose");

// Custom validator for coordinates
const isLatitude = (val) => val >= -90 && val <= 90;
const isLongitude = (val) => val >= -180 && val <= 180;

const schoolSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters long"],
    },
    lat: {
      type: Number,
      required: [true, "Latitude is required"],
      validate: {
        validator: isLatitude,
        message: (props) => `${props.value} is not a valid latitude (-90 to 90)`,
      },
    },
    long: {
      type: Number,
      required: [true, "Longitude is required"],
      validate: {
        validator: isLongitude,
        message: (props) => `${props.value} is not a valid longitude (-180 to 180)`,
      },
    },
  },
  { timestamps: true }
);

const School = model("school", schoolSchema);

module.exports = School;
