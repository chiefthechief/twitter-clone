import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import pool from "../db/index.js"
import userRoutes from "../routes/userRoutes.js"
import tweetRoutes from "../routes/tweetRoutes.js"
import followRoutes from "../routes/followRoutes.js"
import commentRoutes from "../routes/commentRoutes.js"


const app = express()

app.use(cors())
app.use(express.json())
app.use("/users", userRoutes)
app.use("/tweets", tweetRoutes)
app.use("/follows", followRoutes)
app.use("/comments", commentRoutes)

app.get("/", (req, res) => {
    res.send("twitter clone api running")
})

app.get("/testdb", async (req, res) => {
    try {
        const usersResult = await pool.query("SELECT * FROM users")
        const tweetsResult = await pool.query("SELECT * FROM tweets")
        const likesResult = await pool.query("SELECT * FROM likes")
        const commentsResult = await pool.query("SELECT * FROM comments")
        const followsResult = await pool.query("SELECT * FROM follows")

        res.json({
            users: usersResult.rows,
            tweets: tweetsResult.rows,
            likes: likesResult.rows,
            comments: commentsResult.rows,
            follows: followsResult.rows
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch data from database" })
    }
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)

})