import { PrismaClient } from '@prisma/client'


export default async function handler(req, res) {
    
    if (req.method != "POST") {
        return res.status(405).json({ message: "Only POST method is allowed" })
    }
    
    if (!req.body) {
        return res.status(400).json({ message: "Form data not present" })
    }
    
    const prisma = new PrismaClient()
    const { firstName, lastName, email, password } = req.body

    console.log(req.body)

    const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password,
        },
    })

    res.json({ message: "Signup post request", user: newUser })
}