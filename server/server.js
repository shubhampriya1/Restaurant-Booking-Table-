import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connect from "./lib/connect.js";
import Booking from "./models/Booking.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/bookings", async (req, res) => {
  try {
    const { date, time, hours } = req.body;

    if (!date || !time || !hours) {
      return res.status(400).json({
        message: "Date, time, and hours are required.",
      });
    }

    const bookingStartTime = new Date(`${date}T${time}`);
    const bookingEndTime = new Date(bookingStartTime);
    bookingEndTime.setHours(bookingEndTime.getHours() + parseInt(hours));

    const overlappingBooking = await Booking.findOne({
      date,
      $or: [
        {
          $expr: {
            $and: [
              { $lte: ["$time", bookingEndTime] },
              { $gte: ["$time", bookingStartTime] },
            ],
          },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message:
          "A booking already exists that overlaps with the selected date, time, or duration.",
      });
    }

    const booking = new Booking(req.body);
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const bookings = await Booking.find()
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      totalBookings,
      totalPages: Math.ceil(totalBookings / limitNumber),
      currentPage: pageNumber,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Booking by ID
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant Booking API");
});

// Start the Server
const PORT = process.env.PORT || 5000;
(async () => {
  connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error(error);
    });
})();
