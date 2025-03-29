import express from 'express'
import { bookAppointment } from '../services/bookingService.js';

const router = express.Router()

// ******************************************** add an appointmemnt ***********************************//
router.post('/book', async (req, res) => {
    console.log('Booking controller :', req.body);
    try {
        const response = await bookAppointment(req.body);
        if (response.success) {
            return res.status(200).json({ 
                message: response.message, 
                appointment_id: response.appointment_id 
            });
        } else {
            return res.status(400).json({ message: response.error });
        }
    } catch (error) {
        console.error("Error in API:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;