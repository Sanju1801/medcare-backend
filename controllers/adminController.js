import express from 'express'
import { addDoctor, getAllDoctors, deleteDoctor, getAppointments, updateAppointments } from '../services/adminService.js'
// import jwtAuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

// ******************************************** add a doctor ***********************************//
router.post('/doctors/add', async (req, res) => {
    try {
        const response = await addDoctor(req.body);
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


// ********************************************  get a list of all doctors ***********************************//
router.get('/doctors', async (req, res) => {
    try {
        console.log('doctor get controller')
        const response = await getAllDoctors();

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


// ********************************************  delete a doctor ***********************************//
router.delete('/doctors/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;

        if (isNaN(id) || id <= 0) {
            throw new Error("Invalid Doctor ID");
        }

        const response = await deleteDoctor(id);
        if (response.success) {
            return res.status(200).send({ message: response.message });
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.log('Error in DELETE API:', error);
        return res.status(400).send({ message: error.message || "An error occurred" });
    }
});


// ******************************************** booking ***********************************//



// ******************************************** get all appointmemnts with no status ************************************//
router.get('/appointments', async (req, res) => {
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
router.put('/appointments/update', async (req, res) => {
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

// ******************************************** get all appointmemnts **********************************//
router.get('/appointments/all', async (req, res) => {
    try {
        console.log('appointment get controller')
        const response = await getAllAppointments();

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

export default router;
