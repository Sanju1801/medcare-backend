import express from 'express'
import { addDoctor, getAllDoctors, deleteDoctor, filterDoctors } from '../services/doctorService.js'

const router = express.Router()


// ******************************************** add a doctor ***********************************//
router.post('/add', async (req, res) => {
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
router.get('/', async (req, res) => {
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
router.delete('/delete/:id', async (req, res) => {
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


// ********************************************  get a list of filtered doctors with pagination ***********************************//
router.get("/filter", async (req, res) => {
    try {
        const filters = req.query;
        console.log(filters);
        const response = await filterDoctors(filters);

        if (response.success) {
            return res.status(200).json(response.doctors);
        } else {
            return res.status(500).json({ error: response.error });
        }
    } catch (err) {
        console.error("Error in doctor filter API:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
