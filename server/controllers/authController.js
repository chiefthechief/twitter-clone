import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import pool from "../db/index.js"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const loginUser = async (req, res) => {
    const { identifier, password } = req.body
    try {
        const result = await pool.query(`select * from users where email = $1 or username = $1`, [identifier])
        const user = result.rows[0]
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: "5h" })
        res.status(200).json({
            message: "user logged in successfully",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.profile_image_url
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "failed to login user" })
    }
}