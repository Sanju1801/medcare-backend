//what api will send

import express from 'express'
import { addDoctor, deleteDoctor, getAllDoctors, getFilteredDoctors, getsearchedDoctors } from '../services/doctorService.js'
const router =  express.Router()


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
router.get('/',async(req,res)=>{
    try {
        const response = await getAllDoctors();

        if (response.success) {
            return res.status(200).send({data:response.data})
        }
        else throw new Error('error in get api')
    } 
    catch (error) {
        console.log('error in api ',error);
        return res.status(400).send({message:error.message || ''})
    }
})


// get a list of filtered doctors using filters : experience, gender, rating
router.get('/filter', async (req, res) => {
    try {
        const { experience, gender, rating,  perPage, page } = req.query;

        const response = await getFilteredDoctors({ experience, gender, rating, perPage, page });

        if (response.success) {
            return res.status(200).json({ doctors: response.data });
        } else {
            return res.status(500).json({ message: response.error });
        }
    } catch (error) {
        console.error("Error in doctor list API:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// delete doctor by id
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Doctor ID is required");
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


router.get('/search', async (req, res) => {
    try {
        let { filters, perPage, page } = req.query;

        if (!filters) {
            return res.status(400).json({ message: "At least one search filter is required" });
        }

        filters = Array.isArray(filters) ? filters : [filters]; 
        perPage = perPage ? parseInt(perPage) : 6;
        page = page ? parseInt(page) : 1;

        const response = await getsearchedDoctors(filters, perPage, page);

        if (response.success) {
            return res.status(200).json({ doctors: response.doctors });
        } else {
            throw new Error(response.error);
        }
    } 
    catch (error) {
        console.error("Error in Search API:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


//********************************************************* */


// router.get('/search',async(req,res)=>{
//     try {
//         const { name } = req.query; 
//         const response = await searchStudents(name);
//         if (response.success) {
//             return res.status(200).send({data:response.data})
//         }
//         else throw new Error('error in search api')
//     } catch (error) {
//         console.log('error in api ',error);
//         return res.status(400).send({message:error.message || ''})
//     }
// })





// router.put('/update', async (req, res) => {
//     try {
//         const { id } = req.body; 
//         if (!id) {
//             throw new Error("ID is required for updating");
//         }
//         const response = await updateStudents(id, req.body); 
//         if (response.success) {
//             return res.status(200).send({ message: response.message });
//         } else {
//             throw new Error(response.error);
//         }
//     } catch (error) {
//         console.log('Error in PUT API:', error);
//         return res.status(400).send({ message: error.message || "An error occurred" });
//     }
// });




export default router;