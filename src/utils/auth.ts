import { User } from '../entity/User'
import { sign, verify } from 'jsonwebtoken'
import { Response } from 'express'

export function createAccessToken(user: User) {
    return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15s' })
}

export function createRefreshToken(user: User) {
    return sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
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

export function sendRefreshToken(res: Response, token: String): void {
    console.log('cookie was sent')
    res.cookie('rrrt', token, { httpOnly: true })
}

export async function revokeRefreshtoken(userId: number) {
    const user = await User.findOne({ where: { userId } })

    if (user) {
        user.tokenVersion++
        await user.save()
        return true
    }
}
