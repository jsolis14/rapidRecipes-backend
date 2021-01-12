import "reflect-metadata"
import express from 'express';
import config from './config';
import { createConnection } from "typeorm";
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { userAuthResolvers } from "./resolvers/user";
import cookieParser from 'cookie-parser'
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "./utils/auth";
import cors from 'cors';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))



app.use(cookieParser())

app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.rrc

    if (!token) {
        return res.json({ ok: false, accessToken: '' })
    }
    console.log(req.cookies)

    let payload: any = null
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch {
        return res.json({ ok: false, accessToken: '' })
    }
    console.log(payload)
    const user = await User.findOne({ id: payload.userId })

    if (!user) {
        return res.json({ ok: false, accessToken: '' })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return res.json({ ok: false, accessToken: '' })
    }

    sendRefreshToken(res, createRefreshToken(user))
    res.json({ ok: true, accessToken: createAccessToken(user) })
})

const server = new ApolloServer({
    typeDefs: [typeDefs], resolvers: [userAuthResolvers],
    context: ({ res, req }) => {
        // console.log(res)
        return { res, req }
    }
})


server.applyMiddleware({ app, cors: false })
app.listen({ port: 4000 }, () => {
    createConnection(config.database).then(async () => {
        console.log(`🚀 Server ready at local host 4000`);
    })
})
