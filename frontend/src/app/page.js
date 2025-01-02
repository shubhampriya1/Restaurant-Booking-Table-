"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
    guests: "",
    hours: "",
  });

  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings?page=${page}&limit=5`
      );
      const { bookings: fetchedBookings, totalPages: fetchedTotalPages } =
        response.data;

      setBookings(fetchedBookings);
      setTotalPages(fetchedTotalPages);
      setLoading(false);

      const bookedSlots = fetchedBookings.map((booking) => ({
        time: booking.time,
        date: booking.date,
        hours: booking.hours,
      }));

      const allSlots = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
      const updatedAvailability = allSlots.map((slot) => ({
        time: slot,
        available: !bookedSlots.some((booked) => {
          const bookedEndTime = new Date(`${booked.date} ${booked.time}`);
          bookedEndTime.setHours(bookedEndTime.getHours() + booked.hours);

          const currentSlotTime = new Date(`${formData.date} ${slot}`);
          return (
            booked.date === formData.date &&
            currentSlotTime >= new Date(`${booked.date} ${booked.time}`) &&
            currentSlotTime < bookedEndTime
          );
        }),
      }));

      setAvailability(updatedAvailability);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  // Fetch data on initial render and whenever the page or selected date changes
  useEffect(() => {
    fetchBookings();
  }, [page, formData.date]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          error = "Name must be at least 3 characters long.";
        }
        break;
      case "contact":
        if (!/^[0-9]{10}$/.test(value)) {
          error = "Contact must be a valid 10-digit number.";
        }
        break;
      case "date":
        if (!value) {
          error = "Date is required.";
        }
        break;
      case "time":
        if (!value) {
          error = "Time is required.";
        }
        break;
      case "guests":
        if (Number(value) < 1) {
          error = "Guests must be at least 1.";
        }
        break;
      case "hours":
        if (!value || Number(value) < 1 || Number(value) > 5) {
          error = "Hours must be between 1 and 5.";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Submit booking to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.contact ||
      !formData.date ||
      !formData.time ||
      !formData.guests ||
      !formData.hours
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`,
        formData
      );
      setBookingSummary(response.data);
      setPage(1);
      fetchBookings();
      setFormData({
        name: "",
        contact: "",
        date: "",
        time: "",
        guests: "",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${id}`
      );
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 p-4 text-white">
      <h1 className="text-4xl font-bold text-center mb-6">
        Restaurant Table Booking System
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg mx-auto mb-10 border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6">Book a Table</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full border ${
              errors.name ? "border-red-500" : "border-gray-600"
            } rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Contact Field */}
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">
            Contact
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            className={`w-full border ${
              errors.contact ? "border-red-500" : "border-gray-600"
            } rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your contact details"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        {/* Date Field */}
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`w-full border ${
              errors.date ? "border-red-500" : "border-gray-600"
            } rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Time Field */}
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Time</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className={`w-full border ${
              errors.time ? "border-red-500" : "border-gray-600"
            } rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select Time</option>
            {availability.map(
              (slot, index) =>
                slot.available && (
                  <option key={index} value={slot.time}>
                    {slot.time}
                  </option>
                )
            )}
          </select>
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
          )}
        </div>

        {/* Guests Field */}
        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">
            Number of Guests
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleInputChange}
            className={`w-full border ${
              errors.guests ? "border-red-500" : "border-gray-600"
            } rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter number of guests"
          />
          {errors.guests && (
            <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">
            Number of Hours
          </label>
          <input
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleInputChange}
            className={`w-full border ${
              errors.hours ? "border-red-500" : "border-gray-600"
            } rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter number of hours"
          />
          {errors.hours && (
            <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={Object.values(errors).some((error) => error)} // Disable button if there are errors
        >
          Book Table
        </button>
      </form>

      <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg mx-auto mb-10">
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                className="py-3 flex justify-between items-center"
              >
                <span>
                  {booking.name} - {booking.date} at {booking.time} for{" "}
                  {booking.guests} guests
                </span>
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="text-red-400 hover:underline font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-600"
          >
            Previous
          </button>
          <span className="text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      {bookingSummary && (
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Booking Summary</h2>
          <p className="mb-2">
            <strong>Name:</strong> {bookingSummary.name}
          </p>
          <p className="mb-2">
            <strong>Contact:</strong> {bookingSummary.contact}
          </p>
          <p className="mb-2">
            <strong>Date:</strong> {bookingSummary.date}
          </p>
          <p className="mb-2">
            <strong>Time:</strong> {bookingSummary.time}
          </p>
          <p className="mb-2">
            <strong>Guests:</strong> {bookingSummary.guests}
          </p>
          <p className="mb-2">
            <strong>Duration:</strong> {bookingSummary.hours} hours
          </p>

          <span>
            {bookingSummary.name} - {bookingSummary.date} at{" "}
            {bookingSummary.time} for {bookingSummary.guests} guests (
            {bookingSummary.hours} hours)
          </span>
        </div>
      )}
    </div>
  );
}
