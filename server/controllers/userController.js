import pool from "../db/index.js"
import bcrypt from "bcrypt"
import generateRandomNumber from "../utils/generateRamdonNumber.js"

export const getAllUsers = async (req, res) => {
    try{
        const result = await pool.query("select * from users")
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ err: "failed to fetch users" })
        console.log(err)
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query("select * from users where id = $1", [id])
        if (result.rows.length === 0) {
            return res.status(404).json({error: "user not found"})
        }
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ err: "failed to fetch user" })
        console.log(err)
    }
}

export const createUser = async (req, res) => {
    const { username, email, password_hash, profile_image_url, bio } = req.body
    try {
        const id = generateRandomNumber(10)
        const hashedPassword = await bcrypt.hash(password_hash, 10)
        const result = await pool.query(
            `insert into users (id, username, email, password_hash, profile_image_url, bio) values ($1, $2, $3, $4, $5, $6) returning *`,
            [id, username, email, hashedPassword, profile_image_url, bio]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ err: "failed to create user" })
        console.log(err)
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query("delete from users where id = $1 returning *", [id])
        if (result.rows.length === 0) {
            return res.status(404).json({error: "user not found"})
        }
        res.json({message: "user deleted successfully", user: result.rows[0]})
    } catch (err) {
        res.status(500).json({ err: "failed to delete user" })
        console.log(err)
    }
}