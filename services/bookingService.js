import pool from "../db/index.js";

// ******************************************** book an appointmemnt ***********************************//
export const bookAppointment = async (body) => {
    try {
        console.log('booking service', body)

        const { doctor_id, user_id, slot, location_type, status} = body;

        if ( !doctor_id || !user_id || !slot || !location_type) {
            throw new Error("missing payload views")
        }
        const query = 'INSERT INTO appointments (doctor_id, user_id, slot, location_type, status) VALUES ($1, $2, $3, $4, $5)';        
        const result = await pool.query(query, [doctor_id, user_id, slot, location_type, status]);

        if (result.rows) {
            return {
                success: true,
                message: 'Your appointment request has been sent, Please wait till we confirm your appointment'
            }
        }
        else throw new Error('error while saving')
    } 
    catch (err) {
        console.log('error is insert query', err);
        return {
            success: false,
            error: err.message || "Database error"
        }
    }
};


// ******************************************** get all appointmemnts ***********************************//
export const getAppointments = async () => {
    try {
        console.log('appointment get api')
        
        const query = `SELECT * FROM appointments`;
        const res = await pool.query(query);        
        
        console.log('response is ', res);
        if(res.rowCount > 0) {
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
export const updateAppointments = async ({id, status}) => {
    try {
        if (!id) {
            throw new Error("Missing required fields: id");
        }
        if(!status){
            status='';
        }

        const result = await pool.query(
            `UPDATE appointments SET status = $1 WHERE id = $2`, 
            [status, id]
        );

        if (result.rowCount === 0) {
            throw new Error("Appointment not found or no change in status");
        }

        return { success: true, message: "Appointment updated successfully" };
    } catch (err) {
        console.log('Error in update query:', err);
        return { success: false, error: err.message };
    }
};