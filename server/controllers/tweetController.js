import pool from "../db/index.js"
import generateRandomNumber from "../utils/generateRamdonNumber.js"

export const createTweet = async (req, res) => {
    const { user_id, content, image_url } = req.body
    try {
        const id = generateRandomNumber(10)
        console.log(req.body)
        const userResult = await pool.query(`select * from users where id = $1`, [user_id])
        if(userResult.rows.length === 0) {
            return res.status(404).json({ error: "user not found" })
        }
        const result = await pool.query(
            `insert into tweets (id, user_id, content, image_url) values ($1, $2, $3, $4) returning *`,
            [id, user_id, content, image_url]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "unable to create tweet" })
    }
}

export const getAllTweets = async (req, res) => {
    try {
        const result = await pool.query(`select tweets.*, users.username, users.profile_image_url from tweets join users on tweets.user_id = users.id order by created_at desc`)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "unable to fetch tweets" })
    }
}

export const getTweetById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(`select * from tweets where id = $1`, [id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "tweet not found" })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "unable to fetch tweet" })
    }
}

export const deleteTweet = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(`delete from tweets where id = $1 returning *`, [id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "tweet not found" })
        }
        res.json({ message: "tweet deleted successfuly"})
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "unable to delete tweet" })
    }
}

export const getTweetByUser = async (req, res) => {
    const { userId } = req.params
    try {
        const result = await pool.query(`select * from tweets where user_id = $1`, [userId])
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "unable to fetch tweets" })
    }
}