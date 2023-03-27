import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials";
let userAccount = null;

const prisma = new PrismaClient()

const bcrypt = require('bcrypt');
const confirmPasswordHash = (plainPassword, hashedPassword) => {
    return new Promise(resolve => {
        bcrypt.compare(plainPassword, hashedPassword, function(err, res) {
            resolve(res);
        });
    })
}

export const authOptions = {
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.users.findFirst({
                    where: {
                        email: credentials.email
                    }
                });

                if (user !== null) {
                    //Compare the hash
                    const res = await confirmPasswordHash(credentials.password, user.password);
                    if (res === true) {
                        userAccount = {
                            userId: user.userId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            isActive: user.isActive
                        };
                        return userAccount;
                    }
                    else {
                        //TODO Gestire caso password errata
                        console.log("Hash not matched logging in");
                        return null;
                    }
                }
                else {
                    // TODO email non associata a nessun account, registrati
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn(user, account, profile) {
            try
            {
                //the user object is wrapped in another user object so extract it
                user = user.user;
                console.log("Sign in callback", user);
                console.log("User id: ", user.userId)
                if (typeof user.userId !== typeof undefined)
                {

                    if (user.isActive === '1')
                    {
                        console.log("User is active");
                        return user;
                    }
                    else
                    {
                        console.log("User is not active")
                        return false;
                    }
                }
                else
                {
                    console.log("User id was undefined")
                    return false;
                }
            }
            catch (err)
            {
                console.error("Signin callback error:", err);
            }

        },
        async register(firstName, lastName, email, password) {
            try
            {
                await prisma.users.create({
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password
                    }
                })
                return true;
            }
            catch (err)
            {
                console.error("Failed to register user. Error", err);
                return false;
            }

        },
        async session(session, token) {
            if (userAccount !== null)
            {
                //session.user = userAccount;
                session.user = {
                    userId: userAccount.userId,
                    name: `${userAccount.firstName} ${userAccount.lastName}`,
                    email: userAccount.email
                }

            }
            else if (typeof token.user !== typeof undefined && (typeof session.user === typeof undefined
                || (typeof session.user !== typeof undefined && typeof session.user.userId === typeof undefined)))
            {
                session.user = token.user;
            }
            else if (typeof token !== typeof undefined)
            {
                session.token = token;
            }
            return session;
        },
        async jwt(token, user, account, profile, isNewUser) {
            console.log("JWT callback. Got User: ", user);
            if (typeof user !== typeof undefined)
            {
                token.user = user;
            }
            return token;
        }
    }
}
export default NextAuth(authOptions)