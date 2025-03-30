import express from 'express'
import { bookAppointment, getDetails } from '../services/bookingService.js';

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


// ******************************************** get approved appointmemnts ***********************************//
router.post('/details',async (req,res)=>{
    try{
      const {doc_id , appointment_date} = req.body ;
      const doctor_id = parseInt(doc_id) ;
      const result = await getDetails(doctor_id,appointment_date) ;
      console.log('in controller : ', result);
      if(result.success){
        res.status(200).json(
          {
            success : true,
            data : result.data
          }
        )
      }else{
        throw new Error('error in get api')
      }
    }catch(err){
      return res.status(500).json({message : err.message});
    }
  })


export default router;