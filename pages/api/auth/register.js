import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

export default async function handler(req, res) {

    if (req.method != "POST") {
        return res.status(405).json({ message: "Only POST method is allowed" })
    }

    if (!req.body) {
        return res.status(400).json({ message: "Form data not present" })
    }

    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Form data not present" })
    }

    const prisma = new PrismaClient()

    const result = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (result) {
        return res.status(400).json({ message: "A user already exists with this email" })
    }

    const newUser = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: await hash(password, 12),
        },
    })
    delete newUser.password

    res.status(200).json({ message: "User signup successfully", user: newUser })
}