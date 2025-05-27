import pool from "../db/index.js"
import generateRamdomNumber from "../utils/generateRamdonNumber.js"

export const followUser = async (req, res) => {
    const { followerId, followedId } = req.body
    if(followerId === followedId) {
        return res.status(400).json({ message: "You cannot follow yourself" })
    }
    try {
        const existingFollow = await pool.query("select * from follows where follower_id = $1 and followed_id = $2", [followerId, followedId])
        if (existingFollow.rows.length > 0) {
            return res.status(400).json({ message: "You are already following this user" })
        }
        const followId = generateRamdomNumber(10)
        await pool.query(`insert into follows(id, follower_id, followed_id) values ($1, $2, $3)`, [followId, followerId, followedId])
        res.status(200).json({ message: "Followed successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "failed to follow user" })
    }
}

export const unfollowUser = async (req, res) => {
    const { followerId, followedId } = req.body
    try {
        await pool.query("delete from follows where follower_id = $1 and followed_id = $2", [followerId, followedId])
        res.status(200).json({ message: "Unfollowed successfully" })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "failed to unfollow user" })
    }
}

export const getFollowers = async (req, res) => {
    const { userId } = req.params
    try {
        const result = await pool.query(`select u.id, u.username, u.profile_image_url from follows f join users u on f.follower_id = u.id where f.followed_id = $1`, [userId])
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "failed to get followers" })
    }
}

export const getFollowing = async (req, res) => {
    const { userId } = req.params
    try {
        const result = await pool.query(`select u.id, u.username, u.profile_image_url from follows f join users u on f.followed_id = u.id where f.follower_id = $1`, [userId])
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "failed to get following" })
    }
}