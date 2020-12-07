import { User } from '../entity/User'
import { sign, verify } from 'jsonwebtoken'

export function createAccessToken(user: User) {
    return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '60m' })
}

export function createRefreshToken(user: User) {
    return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
}

export function isAuth(context: any): void {
    const auth = context.req.headers['authorization']

    if (!auth) {
        throw new Error("not authenticated")
    }

    try {
        const token = auth.split(" ")[1]
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)
        console.log(payload)
        context.payload = payload
    } catch (err) {
        console.log(err)
        throw new Error("not authenticated")
    }

}
