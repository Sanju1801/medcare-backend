import express from 'express'
import passport from 'passport';

import  saveUser  from '../services/signupService.js';

const router =  express.Router()

router.post('/signup', async (req, res) => {
    try {   
        console.log("controller hit")
        console.log("controller",req.body);
        const response = await saveUser(req.body);
            
        if (response) {
            // return res.status(201).send({ data: response.data });
            return res.status(201).json({
                message: response.message,
                token: response.token,  
                user: response.user,
            })
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.log('Error in API:', error);
        return res.status(400).send({ message: error.message || "An error occurred" });
    }
});

export default router;