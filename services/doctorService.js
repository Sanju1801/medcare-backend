import pool from "../db/index.js";


// ******************************************** get all doctors ***********************************//
export const getAllDoctors = async () => {
    try {
        console.log('doctors get api')

        const query = `SELECT * FROM doctors ORDER BY rating DESC`;
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


// ******************************************** get fitered doctors ***********************************//

export const filterDoctors = async ({ rating, experience, gender, searchQuery = "", page = 1 }) => {
    try {
        let query = "SELECT * FROM doctor_disease_view WHERE 1=1";
        const queryParams = [];

        if (rating && rating !== "all") {
            queryParams.push(rating);
            query += ` AND rating = $${queryParams.length}`;
        }

        if (experience && experience !== "all") {
            switch (experience) {
                case "15+":
                    query += ` AND experience >= $${queryParams.length + 1}`;
                    queryParams.push(15);
                    break;
                case "10-15":
                    query += ` AND experience BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
                    queryParams.push(10, 15);
                    break;
                case "5-10":
                    query += ` AND experience BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
                    queryParams.push(5, 10);
                    break;
                case "3-5":
                    query += ` AND experience BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
                    queryParams.push(3, 5);
                    break;
                case "1-3":
                    query += ` AND experience BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
                    queryParams.push(1, 3);
                    break;
                case "0-1":
                    query += ` AND experience BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
                    queryParams.push(0, 1);
                    break;
                default:
                    break;
            }
        }

        if (gender && gender !== "all") {
            queryParams.push(gender.toLowerCase());
            query += ` AND LOWER(gender) = $${queryParams.length}`;
        }

        if (searchQuery) {
            queryParams.push(`%${searchQuery.toLowerCase()}%`);
            query += ` AND (LOWER(doctor_name) LIKE $${queryParams.length} 
                       OR LOWER(expertise) LIKE $${queryParams.length} 
                       OR LOWER(disease_name) LIKE $${queryParams.length})`;
        }

        // Pagination logic
        const perPage = 6;
        const offset = (page - 1) * perPage;
        queryParams.push(perPage, offset);
        query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

        const result = await pool.query(query, queryParams);
        return { success: true, doctors: result.rows };
    }
    catch (err) {
        console.error("Error fetching doctors:", err);
        return { success: false, error: "Internal Server Error" };
    }
};
