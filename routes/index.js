import express from "express";
import signupController from '../controllers/signupController.js';
import passportController from '../controllers/passportController.js';
import doctorController from '../controllers/doctorController.js';
import bookingController from '../controllers/bookingController.js';
import jwtAuthMiddleware from "../middleware/authMiddleware.js";
import adminController from '../controllers/adminController.js';


const router = express.Router();

router.use('/', signupController);
router.use('/', passportController);
// router.use('/doctors', doctorController)
// router.use('/appointment', bookingController);

router.use('/doctors', jwtAuthMiddleware, doctorController)
router.use('/appointment',jwtAuthMiddleware, bookingController);
router.use('/admin', adminController);

export default router;