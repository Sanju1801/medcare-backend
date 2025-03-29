import pool from "../db/index.js";


// ******************************************** get all doctors ***********************************//
export const getAllDoctors = async () => {
    try {
        const query = `SELECT * FROM doctors ORDER BY rating DESC`;
        const res = await pool.query(query);

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


// ******************************************** get fitered doctors ***********************************//

export const filterDoctors = async ({ rating, experience, gender, searchQuery = "", page = 1 }) => {
    try {
        let query = "SELECT * FROM doctor_disease_view WHERE 1=1";
        let countQuery = "SELECT COUNT(*) FROM doctor_disease_view WHERE 1=1";
        const queryParams = [];

        if (rating && rating !== "all") {
            queryParams.push(rating);
            query += ` AND rating = $${queryParams.length}`;
            countQuery += ` AND rating = $${queryParams.length}`;
        }

        if (experience && experience !== "all") {
            switch (experience) {
                case "16":
                    queryParams.push(15);
                    query += ` AND experience > $${queryParams.length}`;
                    countQuery += ` AND experience > $${queryParams.length}`;
                    break;
                case "10-15":
                    queryParams.push(10);
                    queryParams.push(15);
                    query += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    countQuery += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    break;
                case "5-10":
                    queryParams.push(5);
                    queryParams.push(10);
                    query += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    countQuery += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    break;
                case "3-5":
                    queryParams.push(3);
                    queryParams.push(5);
                    query += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    countQuery += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    break;
                case "1-3":
                    queryParams.push(1);
                    queryParams.push(3);
                    query += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    countQuery += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    break;
                case "0-1":
                    queryParams.push(0);
                    queryParams.push(1);
                    query += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    countQuery += ` AND experience BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
                    break;
                default:
                    break;
            }
        }

        if (gender && gender !== "all") {
            queryParams.push(gender.toLowerCase());
            query += ` AND LOWER(gender) = $${queryParams.length}`;
            countQuery += ` AND LOWER(gender) = $${queryParams.length}`;
        }

        if (searchQuery) {
            queryParams.push(`%${searchQuery.toLowerCase()}%`);
            query += ` AND (LOWER(doctor_name) LIKE $${queryParams.length}
                       OR LOWER(expertise) LIKE $${queryParams.length} 
                       OR LOWER(disease_name) LIKE $${queryParams.length})`;
            countQuery += ` AND (LOWER(doctor_name) LIKE $${queryParams.length}
                       OR LOWER(expertise) LIKE $${queryParams.length} 
                       OR LOWER(disease_name) LIKE $${queryParams.length})`;
        }

        const totalResult = await pool.query(countQuery, queryParams);
        const total = parseInt(totalResult.rows[0].count, 10);

        // Pagination logic
        const perPage = 6;
        const offset = (page - 1) * perPage;
        queryParams.push(perPage);
        queryParams.push(offset);
        query += ` ORDER BY rating DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

        console.log("Executing Query:", query, queryParams);
        
        const result = await pool.query(query, queryParams);
        return { success: true, doctors: result.rows, total };
    }
    catch (err) {
        console.error("Error fetching doctors:", err);
        return { success: false, error: "Internal Server Error" };
    }
};


// ******************************************** get a doctor by id ***********************************//
export const getOneDoctor = async (id) => {
    try {
        console.log('doctors get api')

        const query = `SELECT * FROM doctors WHERE id = $1`;
        const res = await pool.query(query, [id]);

        console.log('response is ', res.rows);

        if (res.rowCount > 0) {
            return {
                success: true,
                data: res.rows[0],
            }
        }
        else throw new Error('Doctor not found')
    }
    catch (err) {
        console.log('error is getOneDoctor query', err);
        return {
            success: false,
            error: err.message || "Database error",
        };
    }
}