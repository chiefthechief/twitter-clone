import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import pool from "../db/index.js"
import userRoutes from "../routes/userRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/users", userRoutes)

app.get("/", (req, res) => {
    res.send("twitter clone api running")
})

app.get("/testdb", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()")
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Database connection failed" })
    }
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)

})