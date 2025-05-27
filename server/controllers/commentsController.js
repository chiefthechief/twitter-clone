import pool from "../db/index.js"
import generateRamdomNumber from "../utils/generateRamdonNumber.js"

export const addComments = async (req, res) => {
    const { user_id, tweet_id, content } = req.body
    if (!user_id || !tweet_id || !content) {
        return res.status(400).json({ error: "All fields are required" })
    }
    try {
        const commentId = generateRamdomNumber(10)
        await pool.query(`insert into comments (id, user_id, tweet_id, content) values ($1, $2, $3, $4)`, [commentId, user_id, tweet_id, content])
        return res.status(201).json({ message: "Comment added successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "error adding comment"})
    }
}

export const getCommentsForTweet = async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId) {
        return res.status(400).json({ message: "Tweet ID is required" })
    }
    try {
        const result = await pool.query(`select comments.id, comments.content, comments.created_at, users.username, users.profile_image_url from comments join users on comments.user_id = users.id where comments.tweet_id = $1 order by comments.created_at desc`, [tweetId])
        return res.status(200).json(result.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error fetching comments" })
    }
}
