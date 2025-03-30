import express from 'express'
import { retrievePassword } from '../services/forgotPasswordService.js';

const router = express.Router()

router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const response = await retrievePassword({email}); 
        if (response.success) {
            return res.status(200).send({ message: response.message });
        } else {
            throw new Error(response.error);
        }
    } 
    catch (error) {
        console.log('Error in PUT API:', error);
        return res.status(400).send({ message: error.message || "An error occurred" });
    }
});

export default router;