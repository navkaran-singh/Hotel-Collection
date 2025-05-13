
import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();



// Route to render the new booking form 
router.post("/new", (req, res) => {
  console.log("new: ",req.body);
  const { userId } = req.body;
  if (!userId) return res.status(400).send("Missing user ID");
  res.render("newBooking", { userId });
});


// Route to handle booking form submission
router.post("/create", async (req, res) => {
  console.log("create: ",req.body);
  const { bookingId, hotel, checkIn, checkOut, status, userId} = req.body;
  const formattedCheckIn = new Date(checkIn).toISOString().split("T")[0];
  const formattedCheckOut = new Date(checkOut).toISOString().split("T")[0];
  if (!userId) return res.status(400).send("Missing user ID");

  try {
    const newBooking = new Booking({
      bookingId,
      hotel,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      status,
      user:userId
    });
    await newBooking.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).send("Error saving booking");
  }
});

// Route to show all bookings for a specific user
router.post("/", async (req, res) => {

  const { userId } = req.body;

  if (!userId) return res.status(400).send("Missing user ID");

  try{
    const bookings = await Booking.find({ user: userId }).sort({ checkIn: 1 });
    res.render("bookings", { bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send("Error fetching bookings");
  }
});

export default router;
