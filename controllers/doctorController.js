import express from 'express'
import { addDoctor, getAllDoctors, deleteDoctor } from '../services/doctorService.js'

const router = express.Router()


// add a doctor
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

// get a list of all doctors
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

router.get("/filter", async (req, res) => {
    try {
        console.log("hit");

        const  filters  = req.query;
        const page = parseInt(req.query.page) || 1;
        // console.log(filters);
        if (!filters) {
            return res.status(400).json({ message: "At least one search filter is required" });
        }

        const response = await filterDoctors(filters, page);
        // console.log("Controller ", response);

        if (response) {
            return res.status(200).json(response);
        } else {
            return res.status(500).json({ message: response.error });
        }
    } catch (error) {
        console.error("Error in doctor list API:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;