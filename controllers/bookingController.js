import express from 'express'
import { bookAppointment, getAppointments, updateAppointments } from '../services/bookingService.js';

const router = express.Router()

// ******************************************** add an appointmemnt ***********************************//
router.post('/book', async (req, res) => {
    console.log('booking controller')
    try {
        const response = await bookAppointment(req.body);
        if (response.success) {
            return res.status(200).send({ message: response.message });
        } else {
            throw new Error(response.error);
        }
    }
    catch (error) {
        console.log('Error in API:', error);
        return res.status(400).send({ message: error.message || "An error occurred" });
    }
});

// ******************************************** get all appointmemnts ***********************************//
router.get('/', async (req, res) => {
    try {
        console.log('appointment get controller')
        const response = await getAppointments();

        if (response.success) {
            return res.status(200).json({ data: response.data });
        } else {
            throw new Error(response.error);
        }
    }
    catch (error) {
        console.log('error in api ', error);
        return res.status(400).send({ message: error.message || '' })
    }
})

// ******************************************** update an appointmemnt ***********************************//
router.put('/update', async (req, res) => {
    try {
        const { id , status } = req.body; 
        if (!id) {
            throw new Error("ID is required for updating");
        }
        const response = await updateAppointments({id, status}); 
        if (response.success) {
            return res.status(200).send({ message: response.message });
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.log('Error in PUT API:', error);
        return res.status(400).send({ message: error.message || "An error occurred" });
    }
});

export default router;