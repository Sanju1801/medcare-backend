import pool from "../db/index.js";

// ******************************************** book an appointmemnt ***********************************//
export const bookAppointment = async (body) => {
    try {
        console.log('booking service', body)

        const { doctor_id, user_id, slot, location_type, status} = body;

        if ( !doctor_id || !user_id || !slot || !location_type) {
            throw new Error("missing payload values")
        }

        const slotTimestamp = new Date(slot);
        if (isNaN(slotTimestamp)) {
            throw new Error("Invalid slot format");
        }

        const hours = slotTimestamp.getHours();
        const minutes = slotTimestamp.getMinutes();

        const query = 'INSERT INTO appointments (doctor_id, user_id, slot, location_type, status) VALUES ($1, $2, $3, $4, $5) RETURNING id';        
        const result = await pool.query(query, [doctor_id, user_id, slotTimestamp, location_type, status || '']);

        if (result.rowCount > 0) {
            return {
                success: true,
                message: 'Your appointment request has been sent. Please wait for confirmation.',
                appointment_id: result.rows[0].id
            };
        } else {
            throw new Error("Error while booking appointment");
        }
    } 
    catch (err) {
        console.log('error is insert query', err);
        return {
            success: false,
            error: err.message || "Database error"
        }
    }
};