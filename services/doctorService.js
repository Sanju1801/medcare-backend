import pool from "../db/index.js";

export const getAllDoctors = async () => {
    try {
        const query = `SELECT * FROM doctors ORDER BY rating DESC`;
        const res = await pool.query(query);        
        
        console.log('response is ', res);
        return {
            success: true,
            data: res.rows,
        }
    } 
    catch (err) {
        console.log('error is select query', err);
        return {
            success: false,
            error: err,
        }
    }
}


export const addDoctor = async (body) => {
    try {
        const { name, title, YOE, picture_url, speciality, address, NOR, rating , gender} = body;
        console.log(name);

        if ( !name || !title || !YOE || !picture_url || !speciality || !address || !rating || !gender) {
            throw new Error("missing payload views")
        }
        

        const result = await pool.query('INSERT INTO doctors (name, title, YOE, picture_url, speciality, address, NOR, rating, gender) VALUES ($1,$2,$3, $4, $5, $6, $7, $8, $9)', [name, title, YOE, picture_url, speciality, address, NOR, rating, gender]);
        console.log('save query response', result);

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
            error: err,
        }
    }
}


export const deleteDoctor = async (id) => {
    try {
        await pool.query("DELETE FROM doctors WHERE id = $1", [id]);
        return { success: true, message: "Doctor deleted successfully" };
    } 
    catch (err) {
        console.log('Error in delete query:', err);
        return { success: false, error: err.message };
    }
};


export const getFilteredDoctors = async ({ experience, gender, rating, perPage, page }) => {
    try {
        let query = `SELECT id, name, title, picture_url, speciality AS expertise, YOE AS experience, rating, gender FROM doctors`;
        let conditions = [];
        let values = [];
        
        if (experience) {
            conditions.push(`YOE >= $${values.length + 1}`);
            values.push(experience);
        }
        if (gender) {
            conditions.push(`gender = $${values.length + 1}`);
            values.push(gender);
        }
        if (rating) {
            conditions.push(`rating = $${values.length + 1}`);
            values.push(rating);
        }
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY rating DESC"; 

        //pagination
        perPage = perPage ? parseInt(perPage) : 6;
        page = page ? parseInt(page) : 1;
        const offset = (page - 1) * perPage;

        query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(perPage, offset);

        const result = await pool.query(query, values);
        if(result.rows){
            return { success: true, data: result.rows };
        }
        else throw new Error("no doctor found");
    } 
    catch (error) {
        console.error("Error fetching doctors:", error);
        return { success: false, error: "Database error" };
    }
};

export const getsearchedDoctors = async (filters, perPage = 6, page = 1) => {
    try {
        let query = `SELECT id, name, title, picture_url AS picture, speciality AS expertise, YOE AS experience, rating 
                     FROM doctors WHERE 1=1 `;
        let values = [];
        let index = 1;

        // Apply filters dynamically
        if (filters.length > 0) {
            filters.forEach((filter) => {
                query += ` AND (LOWER(name) LIKE $${index} OR LOWER(title) LIKE $${index} OR LOWER(speciality) LIKE $${index})`;
                values.push(`%${filter.toLowerCase()}%`);
                index++;
            });
        }

        // Pagination logic
        perPage = parseInt(perPage);
        page = parseInt(page);
        const offset = (page - 1) * perPage;

        query += ` ORDER BY rating DESC LIMIT $${index} OFFSET $${index + 1}`;
        values.push(perPage, offset);

        const result = await pool.query(query, values);
        return { success: true, doctors: result.rows };
    } catch (error) {
        console.error("Error in searching doctors:", error);
        return { success: false, message: "Database error" };
    }
}




// *********************************************************
// export const updateStudents = async (body) => {
//     try {
//         const { id,full_name,age, department_id } = body;
//         if (!full_name || !department_id || !age) {
//             throw new Error("missing payload views")
//         }
//         const result = await pool.query(`UPDATE students SET full_name = $1, department_id = $2, age = $3 WHERE id = $4`,
//             [full_name, department_id, age, id]
//         );

//         if (result.rowCount > 0) 
//         {
//             return { success: true, message: "Student updated successfully" };
//         } else {
//             throw new Error("Student not found");
//         }
//     } catch (err) {
//         console.log('Error in update query:', err);
//         return { success: false, error: err.message };
//     }
// };




// export const searchStudents = async (name) => {
//     try {
//         console.log(name);  
//         const result = await pool.query(`SELECT * FROM studentS WHERE full_name ILIKE $1`, [name]);
//         if (result.rows.length > 0) {
//             return { success: true, data: result.rows };
//         } else {
//             return { success: false, message: "No students found" };
//         }
//     } catch (err) {
//         console.log('Error in search query:', err);
//         return { success: false, error: err.message };
//     }
// };