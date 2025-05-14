import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()


// Initialize the Pool with the database connection string from environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

// // Define the schema SQL directly as a string
// const schemaSQL = `
//     DROP TABLE IF EXISTS users, tweets, likes, follows, comments CASCADE;

//   CREATE TABLE IF NOT EXISTS users (
//     id serial PRIMARY KEY,
//     username VARCHAR(50) NOT NULL UNIQUE,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     password_hash VARCHAR(255) NOT NULL,
//     profile_image_url TEXT,
//     bio TEXT,
//     created_at TIMESTAMP DEFAULT current_timestamp
//   );

//   CREATE TABLE IF NOT EXISTS tweets (
//     id serial PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     content TEXT NOT NULL,
//     image_url TEXT,
//     created_at TIMESTAMP DEFAULT current_timestamp
//   );

//   CREATE TABLE IF NOT EXISTS likes (
//     id serial PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE,
//     created_at TIMESTAMP DEFAULT current_timestamp
//   );

//   CREATE TABLE IF NOT EXISTS follows (
//     id serial PRIMARY KEY,
//     follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     followed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     created_at TIMESTAMP DEFAULT current_timestamp
//   );

//   CREATE TABLE IF NOT EXISTS comments (
//     id serial PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE,
//     content TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT current_timestamp
//   );
// `

// /**
//  * Function to run the schema SQL to create tables
//  */
// const runSchema = async () => {
//     try {
//         // Connect to the database and execute the schema
//         const client = await pool.connect()
//         console.log("Connected to the database successfully!")

//         // Run the SQL queries to create tables
//         await client.query(schemaSQL)
//         console.log("Schema successfully applied!")

//         // Release the client after executing the queries
//         client.release()
//     } catch (err) {
//         console.error("Error executing SQL:", err.stack)
//     } finally {
//         // Close the pool connection
//         await pool.end()
//     }
// }

// // Call the function to run the schema
// runSchema().catch((err) => {
//     console.error("Error running schema:", err)
// })

export default pool
