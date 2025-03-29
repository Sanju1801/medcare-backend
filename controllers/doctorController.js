import express from 'express'
import { addDoctor, getAllDoctors, deleteDoctor, filterDoctors, getOneDoctor } from '../services/doctorService.js'
// import jwtAuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()


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



// ********************************************  get a list of filtered doctors with pagination ***********************************//
// router.get("/filter", jwtAuthMiddleware, async (req, res) => {

router.get("/filter", async (req, res) => {
    try {
        const filters = req.query;
        console.log(filters);
        const response = await filterDoctors(filters);

        if (response.success) {
            return res.status(200).json(response);

        } else {
            return res.status(500).json({ error: response.error });
        }
    } catch (err) {
        console.error("Error in doctor filter API:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ********************************************  get a doctor by id ***********************************//
router.get('/profile/:id', async (req, res) => {
    try {
        let { id } = req.params;

        if (isNaN(id) || id <= 0) {
            throw new Error("Invalid Doctor ID");
        }
        const response = await getOneDoctor(id);

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
