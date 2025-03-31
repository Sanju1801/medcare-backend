import pool from "../db/index.js";
import { sendEmail } from './emailService.js';


// ******************************************** get all doctors ***********************************//
export const getAllDoctors = async () => {
    try {
        console.log('doctors get api')

        const query = `SELECT * FROM doctors`;
        const res = await pool.query(query);

        console.log('response is ', res);
        if (res) {
            return {
                success: true,
                data: res.rows,
            }
        }
        else throw new Error('error in SELECT query')
    }
    catch (err) {
        console.log('error is select query', err);
        return {
            success: false,
            error: err.message || "Database error",
        };
    }
}

// ******************************************** add a doctor  ***********************************//
export const addDoctor = async (body) => {
    try {
        const { name, title, YOE, picture_url, speciality, address, NOR, rating, gender } = body;
        console.log(name);

        if (!name || !title || !YOE || !picture_url || !speciality || !address || !NOR || !rating || !gender) {
            throw new Error("missing required fields")
        }
        const parsedYOE = parseInt(YOE, 10);
        const parsedNOR = parseInt(NOR, 10);
        const parsedRating = Math.round(parseFloat(rating));


        const query = `INSERT INTO doctors (name, title, YOE, picture_url, speciality, address, NOR, rating, gender) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
        const values = [name, title, parsedYOE, picture_url, speciality, address, parsedNOR, parsedRating, gender]
        const result = await pool.query(query, values);

        console.log('INSERT query response', result);
        if (result.rows) {
            return {
                success: true,
                message: "doctor added"
            }
        }
        else throw new Error('error while saving')
    }
    catch (err) {
        console.log('error is insert query', err);
        return {
            success: false,
            error: err.message || "Database error",
        };
    }
}

// ******************************************** delete a doctor ***********************************//
export const deleteDoctor = async (id) => {
    try {

        const result = await pool.query("DELETE FROM doctors WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return { success: false, error: "Doctor not found" };
        }
        return { success: true, message: "Doctor deleted successfully" };
    }
    catch (err) {
        console.log('Error in delete query:', err);
        return { success: false, error: err.message };
    }
};


// ******************************************** booking ***********************************/


// ******************************************** get all appointmemnts ***********************************//
export const getAppointments = async () => {
    try {
        console.log('appointment get api')

        const query = `SELECT * FROM appointments WHERE status=''`;
        const res = await pool.query(query);

        console.log('response is ', res);
        if (res.rows) {
            return {
                success: true,
                data: res.rows,
            }
        }
        else throw new Error('error in SELECT query')
    }
    catch (err) {
        console.log('error is select query', err);
        return {
            success: false,
            error: err.message || "Database error",
        };
    }
}

// ******************************************** update an appointmemnt ***********************************//
export const updateAppointments = async ({ id, status }) => {
    try {
        if (!id) {
            throw new Error("Missing required fields: id");
        }
        if (!status) {
            status = '';
        }
        const appointment = await pool.query(
            `SELECT email, slot, location_type FROM appointments 
            INNER JOIN users ON appointments.user_id = users.id 
            WHERE appointments.id = $1`,
            [id]
        );
        if (appointment.rowCount === 0) {
            throw new Error("Appointment not found");
        }
        const userEmail = appointment.rows[0].email;
        const slot = appointment.rows[0].slot;
        const location_type = appointment.rows[0].location_type;

        const result = await pool.query(
            `UPDATE appointments SET status = $1 WHERE id = $2`,
            [status, id]
        );

        if (result.rowCount === 0) {
            throw new Error("Appointment not found or no change in status");
        }

        const emailSubject = `Your Appointment Status Update`;
        let emailBody;
        if (location_type === 'online' && status === 'approved') {
            emailBody = `Hello,\n\nYour appointment for slot (${slot}) is booked.\nBe available for video consult on time.\n\nThank you.`;
        } else if (location_type === 'offline' && status === 'approved') {
            emailBody = `Hello,\n\nYour appointment for slot (${slot}) is booked.\nBe present on location on time.\n\nThank you.`;
        }  else {
            emailBody = `Hello,\n\nYour appointment for slot (${slot}) is not booked.\n\nThank you.`;
        }

        await sendEmail(userEmail, emailSubject, emailBody);
        return { success: true, message: "Appointment updated and email sent successfully" };
    }
    catch (err) {
        console.log('Error in update query:', err);
        return { success: false, error: err.message };
    }
};

// ******************************************** get all appointmemnts ***********************************//
export const getAllAppointments = async () => {
    try {
        console.log('appointment get api')

        const query = `SELECT * FROM appointments`;
        const res = await pool.query(query);

        console.log('response is ', res);
        if (res.rowCount > 0) {
            return {
                success: true,
                data: res.rows,
            }
        }
        else throw new Error('error in SELECT query')
    }
    catch (err) {
        console.log('error is select query', err);
        return {
            success: false,
            error: err.message || "Database error",
        };
    }
}