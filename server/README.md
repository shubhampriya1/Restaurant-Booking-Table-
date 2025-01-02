# Restaurant Table Booking System

This project is a full-stack web application for managing table bookings at a restaurant. The application includes a client-side interface for users to book tables and a server-side backend to handle booking management.

---

## Features

### Client

- User-friendly interface for booking tables.
- Validation for booking details (e.g., name, contact number, date, time, and number of hours).
- Displays availability of time slots.
- Booking summary after submission.
- Pagination support for viewing existing bookings.

### Server

- REST API for managing bookings.
- MongoDB integration for storing booking data.
- Validation to prevent overlapping bookings.

---

## Project Structure

```
/
|-- server/                # Backend code
|   |-- .env              # Environment variables for server
|   |-- server.js         # Entry point for the server
|   |-- models/           # Mongoose models
|
|-- client/                # Frontend code
|   |-- .env              # Environment variables for client
|   |-- app/                # Next.js pages
|   |-- components/       # React components
|   |-- styles/           # CSS files
```

---

## Environment Variables

### **Server `.env`**

Located at `server/.env`:

```env
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
```

- **MONGO_URI**: MongoDB connection string.
- **PORT**: Port number for the backend server.

### **Client `.env`**

Located at `client/.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

- **NEXT_PUBLIC_BACKEND_URL**: Base URL for the backend API.

---

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/shubhampriya1/Restaurant-Booking-Table-.git
   cd Restaurant-Booking-Table-
   ```

2. Set up the server:

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server/` directory and add the required environment variables.

3. Start the backend server:

   ```bash
   npm start
   ```

4. Set up the client:

   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the `frontend/` directory and add the required environment variables.

5. Start the frontend client:

   ```bash
   npm run dev
   ```

6. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## API Endpoints

### **GET /api/bookings**

Fetch all bookings with pagination.

- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of bookings per page (default: 5)

### **POST /api/bookings**

Create a new booking.

- **Body Parameters**:
  - `name`: Name of the customer
  - `contact`: Contact number
  - `date`: Date of booking
  - `time`: Time of booking
  - `hours`: Duration in hours
  - `guests`: Number of guests

### **DELETE /api/bookings/:id**

Delete a booking by its ID.

---

## Validation Rules

### **Frontend**

- Name: Must be at least 3 characters.
- Contact: Must be a 10-digit number.
- Date: Cannot be empty.
- Time: Must be selected.
- Guests: Must be at least 1.
- Hours: Must be at least 1.

### **Backend**

- Prevent overlapping bookings for the same date, time, and duration.

---

## Technologies Used

### Frontend

- React
- Next.js
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB

---

## License

This project is licensed under the MIT License.
