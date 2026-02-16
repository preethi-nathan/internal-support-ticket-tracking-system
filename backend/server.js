require("dotenv").config();
const express=require("express");
const cors=require("cors");
const app=express();
const db = require("./db");

app.use(cors());
app.use(express.json());
app.get("/api/tickets", (req, res) => {

    const { status, priority } = req.query;

    let query = "SELECT * FROM tickets WHERE 1=1";
    let values = [];

    if (status) {
        query += " AND status = ?";
        values.push(status);
    }

    if (priority) {
        query += " AND priority = ?";
        values.push(priority);
    }

    db.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(results);
    });
});


app.post("/api/tickets", (req, res) => {

    const { title, description, priority, assigned_to } = req.body;

    // Backend validation
    if (!title || !description || !priority) {
        return res.status(400).json({ error: "Required fields missing" });
    }

    const query = `
        INSERT INTO tickets (title, description, priority, assigned_to)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [title, description, priority, assigned_to], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({ message: "Ticket created successfully" });
    });
});
app.put("/api/tickets/:id", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    const query = "UPDATE tickets SET status = ? WHERE id = ?";

    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Ticket updated successfully" });
    });
});

app.delete("/api/tickets/:id", (req, res) => {

    const { id } = req.params;

    const query = "DELETE FROM tickets WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Ticket deleted successfully" });
    });
});



const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);});