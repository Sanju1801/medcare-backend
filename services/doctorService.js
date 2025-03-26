import pool from "../db/index.js";

export const getAllDoctors = async () => {
    try {
        console.log('doctors get api')
        
        const query = `SELECT * FROM doctors ORDER BY rating DESC`;
        const res = await pool.query(query);        
        
        console.log('response is ', res);
        if(res) {
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


export const addDoctor = async (body) => {
    try {
        const { name, title, YOE, picture_url, speciality, address, NOR, rating , gender} = body;
        console.log(name);

        if ( !name || !title || !YOE || !picture_url || !speciality || !address || !NOR || !rating || !gender) {
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
        if (result.rowCount > 0) {
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
