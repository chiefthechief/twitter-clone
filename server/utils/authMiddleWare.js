import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "authorization header missing" })
    }
    const token = authHeader.split(" ")[1]
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "invalid token" })
    }
}