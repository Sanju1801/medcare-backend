import express from "express";
import signupController from '../controllers/signupController.js';
import passportController from '../controllers/passportController.js';
import doctorController from '../controllers/doctorController.js';

const router = express.Router();

router.use('/', signupController);
router.use('/', passportController);
router.use('/doctors', doctorController)
console.log('v1 index')

export default router;