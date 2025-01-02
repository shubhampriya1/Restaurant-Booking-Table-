"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
    guests: "",
  });

  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSummary, setBookingSummary] = useState(null);

  // Fetch all bookings and update availability
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bookings");
      const bookedSlots = response.data.map((booking) => ({
        time: booking.time,
        date: booking.date,
      }));

      const allSlots = ["6:00 PM", "7:00 PM", "8:00 PM"];
      const updatedAvailability = allSlots.map((slot) => ({
        time: slot,
        available: !bookedSlots.some(
          (booked) => booked.time === slot && booked.date === formData.date
        ),
      }));

      setAvailability(updatedAvailability);
      setBookings(response.data); // Store bookings
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Fetch data on initial render and whenever the selected date changes
  useEffect(() => {
    fetchBookings();
  }, [formData.date]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit booking to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.contact ||
      !formData.date ||
      !formData.time ||
      !formData.guests
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        formData
      );
      setBookingSummary(response.data);
      fetchBookings(); // Refresh bookings and availability
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  // Delete booking by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      fetchBookings(); // Refresh bookings and availability
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 p-4 text-white">
      <h1 className="text-4xl font-bold text-center mb-6">
        Restaurant Table Booking System
      </h1>

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg mx-auto mb-10 border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6">Book a Table</h2>
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-600 rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">
            Contact
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            className="w-full border border-gray-600 rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your contact details"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border border-gray-600 rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Time</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full border border-gray-600 rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">
            Number of Guests
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleInputChange}
            className="w-full border border-gray-600 rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter number of guests"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Book Table
        </button>
      </form>

      {/* Availability Display */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg mx-auto mb-10">
        <h2 className="text-2xl font-semibold mb-4">Availability</h2>
        <ul className="divide-y divide-gray-700">
          {availability.map((slot, index) => (
            <li
              key={index}
              className={`py-3 text-lg font-medium ${
                slot.available ? "text-green-400" : "text-red-400"
              }`}
            >
              {slot.time} - {slot.available ? "Available" : "Booked"}
            </li>
          ))}
        </ul>
      </div>

      {/* Booking List */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg mx-auto mb-10">
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
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
      </div>

      {/* Booking Summary */}
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
        </div>
      )}
    </div>
  );
}
