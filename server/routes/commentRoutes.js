import express from "express"
import {
    addComments,
    getCommentsForTweet
} from "../controllers/commentsController.js"

const router = express.Router()

router.post("/", addComments)
router.get("/:tweetId", getCommentsForTweet)

export default router