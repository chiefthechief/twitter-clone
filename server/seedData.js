import { Client } from "pg"
import { faker } from "@faker-js/faker"
import dotenv from "dotenv"
dotenv.config()

// Database connection
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

await client.connect()

// Main seed function
async function seed() {
    try {
        console.log("Seeding database...")

        // Create users first
        const userIds = await insertUsers(100)
        console.log(`Inserted ${userIds.length} users`)

        // Create tweets — each user makes 10 tweets
        const tweetIds = await insertTweets(userIds, 10)
        console.log(`Inserted ${tweetIds.length} tweets`)

        // Each user follows 5 random other users (avoiding self-follow)
        await insertFollows(userIds, 5)
        console.log(`Inserted follows`)

        // Each tweet gets 10 random likes
        await insertLikes(tweetIds, userIds, 10)
        console.log(`Inserted likes`)

        // Each tweet gets 5 random comments
        await insertComments(tweetIds, userIds, 5)
        console.log(`Inserted comments`)

        console.log("✅ Database seeded successfully!")
    } catch (err) {
        console.error("❌ Error seeding data:", err)
    } finally {
        await client.end()
    }
}

// Insert users
async function insertUsers(count) {
    const users = []
    for (let i = 0; i < count; i++) {
        const username = faker.internet.userName()
        const email = faker.internet.email()
        const password_hash = faker.internet.password()
        const profile_image_url = faker.image.avatarGitHub()
        const bio = faker.lorem.sentence()

        const result = await client.query(
            `INSERT INTO users (username, email, password_hash, profile_image_url, bio)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [username, email, password_hash, profile_image_url, bio]
        )
        users.push(result.rows[0].id)
    }
    return users
}

// Insert tweets for each user
async function insertTweets(userIds, tweetsPerUser) {
    const tweetIds = []
    for (const userId of userIds) {
        for (let i = 0; i < tweetsPerUser; i++) {
            const content = faker.lorem.sentence()
            const image_url = faker.image.urlPicsumPhotos()
            const result = await client.query(
                `INSERT INTO tweets (user_id, content, image_url)
         VALUES ($1, $2, $3) RETURNING id`,
                [userId, content, image_url]
            )
            tweetIds.push(result.rows[0].id)
        }
    }
    return tweetIds
}

// Insert follows (each user follows N other random users)
async function insertFollows(userIds, followsPerUser) {
    for (const followerId of userIds) {
        const shuffled = faker.helpers.shuffle(userIds.filter(id => id !== followerId))
        const followees = shuffled.slice(0, followsPerUser)

        for (const followedId of followees) {
            await client.query(
                `INSERT INTO follows (follower_id, followed_id)
         VALUES ($1, $2)`,
                [followerId, followedId]
            )
        }
    }
}

// Insert likes (each tweet gets N random likes)
async function insertLikes(tweetIds, userIds, likesPerTweet) {
    for (const tweetId of tweetIds) {
        const shuffled = faker.helpers.shuffle(userIds)
        const likers = shuffled.slice(0, likesPerTweet)

        for (const userId of likers) {
            await client.query(
                `INSERT INTO likes (user_id, tweet_id)
         VALUES ($1, $2)`,
                [userId, tweetId]
            )
        }
    }
}

// Insert comments (each tweet gets N random comments)
async function insertComments(tweetIds, userIds, commentsPerTweet) {
    for (const tweetId of tweetIds) {
        const shuffled = faker.helpers.shuffle(userIds)
        const commenters = shuffled.slice(0, commentsPerTweet)

        for (const userId of commenters) {
            const content = faker.lorem.sentence()
            await client.query(
                `INSERT INTO comments (user_id, tweet_id, content)
         VALUES ($1, $2, $3)`,
                [userId, tweetId, content]
            )
        }
    }
}

// Run seeding
seed()
