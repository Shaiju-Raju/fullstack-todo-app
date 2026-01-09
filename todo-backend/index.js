import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";


dotenv.config();
const app = express()
const port = process.env.PORT;


app.use(cors())
app.use(express.json())
app.use("/auth", authRoutes);






app.get("/todos", authMiddleware, async (req,res) => {
try {
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1",[req.user.userID]);
    res.json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).json({error: "Failed to fetch todos"});
}  
})


app.get("/", (req, res) => {
    res.send("the Server is Running");
})

app.post("/todos", authMiddleware, async (req,res) => {
try {
    const {text} = req.body;
    const result = await pool.query("INSERT INTO todos (text, user_id) VALUES ($1, $2) RETURNING *",[text, req.user.userID]);
    res.json(result.rows[0]);
} catch (err) {
    console.error(err);
    res.status(500).json({error: "Database insert failed"});
}
})

app.delete("/todos/:id", authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.status(400).json({error: "Invalid ID"})
    }

try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1 AND user_id =$2 RETURNING *", [id, req.user.userID]);

    if(result.rowCount === 0) {
        return res.status(400).json({error: "Not Authorized"});
    }

    res.json(result.rows[0]);

} catch (err) {
    console.error(err);
    res.status(500).json({error: "Database Deletion Failed"});
}
})

app.put("/todos/:id", authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const updatedText = req.body.text

    if(isNaN(id)) {
        return res.status(400).json({error: "Invalid ID"});
    }

    try {
        const result = await pool.query(`UPDATE todos SET text = $1 WHERE id = $2 AND user_id =$3 RETURNING *`,[updatedText,id, req.user.userID]);
        res.json(result.rows[0])

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Database updation failed!"});
          
}});

app.listen(port, () => {
    console.log(`Server is running on${port}`);
})