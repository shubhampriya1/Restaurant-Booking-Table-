import mongoose from "mongoose";

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  hours: {
    type: Number,
    required: true,
    min: 1,
  },
  contact: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        // Validate phone number format (basic example for 10 digits)
        return /^[0-9]{10}$/.test(value);
      },
      message: "Invalid contact number. Please enter a 10-digit number.",
    },
  },
});

// Export the Booking model
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
