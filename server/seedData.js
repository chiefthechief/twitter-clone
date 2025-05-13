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

// Utility function to insert 1000 random users
async function insertUsers() {
    const users = []
    for (let i = 0; i < 1000; i++) {
        const username = faker.internet.username()
        const email = faker.internet.email()
        const password_hash = faker.internet.password()
        const profile_image_url = faker.image.avatarGitHub() // Better varied avatars
        const bio = faker.lorem.sentence()

        users.push(`(
      '${username}', 
      '${email}', 
      '${password_hash}', 
      '${profile_image_url}', 
      '${bio}'
    )`)
    }

    const insertQuery = `
    INSERT INTO users (username, email, password_hash, profile_image_url, bio)
    VALUES ${users.join(", ")}
  `
    await client.query(insertQuery)
    console.log("Inserted 1000 users.")
}

// Utility function to insert 1000 random tweets
async function insertTweets() {
    const tweets = []
    const userIds = await getRandomUserIds(1000)

    for (let i = 0; i < 1000; i++) {
        const user_id = userIds[i % userIds.length]
        const content = faker.lorem.sentence()
        const image_url = faker.image.urlPicsumPhotos() // Realistic tweet image URLs

        tweets.push(`(
      ${user_id}, 
      '${content}', 
      '${image_url}'
    )`)
    }

    const insertQuery = `
    INSERT INTO tweets (user_id, content, image_url)
    VALUES ${tweets.join(", ")}
  `
    await client.query(insertQuery)
    console.log("Inserted 1000 tweets.")
}

// Utility function to insert 1000 random likes
async function insertLikes() {
    const likes = []
    const tweetIds = await getRandomTweetIds(1000)
    const userIds = await getRandomUserIds(1000)

    for (let i = 0; i < 1000; i++) {
        const user_id = userIds[i % userIds.length]
        const tweet_id = tweetIds[i % tweetIds.length]
        likes.push(`(${user_id}, ${tweet_id})`)
    }

    const insertQuery = `
    INSERT INTO likes (user_id, tweet_id)
    VALUES ${likes.join(", ")}
  `
    await client.query(insertQuery)
    console.log("Inserted 1000 likes.")
}

// Utility function to insert 1000 random follows
async function insertFollows() {
    const follows = []
    const userIds = await getRandomUserIds(1000)

    for (let i = 0; i < 1000; i++) {
        const follower_id = userIds[i % userIds.length]
        const followed_id = userIds[(i + 1) % userIds.length] // Avoid self-follow

        follows.push(`(${follower_id}, ${followed_id})`)
    }

    const insertQuery = `
    INSERT INTO follows (follower_id, followed_id)
    VALUES ${follows.join(", ")}
  `
    await client.query(insertQuery)
    console.log("Inserted 1000 follows.")
}

// Utility function to insert 1000 random comments
async function insertComments() {
    const comments = []
    const tweetIds = await getRandomTweetIds(1000)
    const userIds = await getRandomUserIds(1000)

    for (let i = 0; i < 1000; i++) {
        const user_id = userIds[i % userIds.length]
        const tweet_id = tweetIds[i % tweetIds.length]
        const content = faker.lorem.sentence()

        comments.push(`(${user_id}, ${tweet_id}, '${content}')`)
    }

    const insertQuery = `
    INSERT INTO comments (user_id, tweet_id, content)
    VALUES ${comments.join(", ")}
  `
    await client.query(insertQuery)
    console.log("Inserted 1000 comments.")
}

// Helper function to get random user IDs
async function getRandomUserIds(count) {
    const result = await client.query("SELECT id FROM users")
    return result.rows.map(row => row.id).slice(0, count)
}

// Helper function to get random tweet IDs
async function getRandomTweetIds(count) {
    const result = await client.query("SELECT id FROM tweets")
    return result.rows.map(row => row.id).slice(0, count)
}

// Seed the data
async function seed() {
    try {
        await insertUsers()
        await insertTweets()
        await insertLikes()
        await insertFollows()
        await insertComments()
        console.log("Database seeded successfully!")
    } catch (err) {
        console.error("Error seeding data:", err)
    } finally {
        await client.end()
    }
}

seed()