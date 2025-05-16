import express from "express"
import {
    getAllTweets,
    getTweetById,
    createTweet,
    deleteTweet,
    getTweetByUser,
} from "../controllers/tweetController.js"

const router = express.Router()

router.get("/", getAllTweets)
router.post("/", createTweet)
router.get("/:id", getTweetById)
router.delete("/:id", deleteTweet)
router.get("/user/:userId", getTweetByUser)

export default router