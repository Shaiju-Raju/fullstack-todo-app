import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import pool from "./db.js";

dotenv.config();
const app = express()
const port = process.env.PORT;


app.use(cors())
app.use(express.json())





app.get("/todos", async (req,res) => {
try {
    const result = await pool.query("SELECT * FROM todos");
    res.json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).json({error: "Failed to fetch todos"});
}  
})


app.get("/", (req, res) => {
    res.send("the Server is Running");
})

app.post("/todos", async (req,res) => {
try {
    const {text} = req.body;
    const result = await pool.query("INSERT INTO todos (text) VALUES ($1) RETURNING *",[text]);
    res.json(result.rows[0]);
} catch (err) {
    console.error(err);
    res.status(500).json({error: "Database insert failed"});
}
})

app.delete("/todos/:id", async (req, res) => {
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.status(400).json({error: "Invalid ID"})
    }

try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1 RETURNING *", [id]);

    if(result.rowCount === 0) {
        return res.status(400).json({error: "Todo Not Found"});
    }

    res.json(result.rows[0]);

} catch (err) {
    console.error(err);
    res.status(500).json({error: "Database Deletion Failed"});
}
})

app.put("/todos/:id", async (req, res) => {
    const id = Number(req.params.id);
    const updatedText = req.body.text

    if(isNaN(id)) {
        return res.status(400).json({error: "Invalid ID"});
    }

    try {
        const result = await pool.query(`UPDATE todos SET text = $1 WHERE id = $2 RETURNING *`,[updatedText,id]);
        res.json(result.rows[0])

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Database updation failed!"});
          
}});

app.listen(port, () => {
    console.log(`Server is running on${port}`);
})