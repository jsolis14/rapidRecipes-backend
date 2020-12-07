import * as bcrypt from 'bcrypt';
import { User } from './entity/User';
import * as yup from 'yup';
import { validate } from 'uuid';
import { formatYupError } from './utils/formatYupError';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
interface HelloQueryArgs {
    name: string
}

interface RegisterMutationArgs {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface myContext {
    req: Request
    res: Response
}
interface ResolverMap {
    [key: string]: {
        [key: string]: (parent: any, args: any, context: {}, info: any) => any
    }
}

interface LoginMutationArgs {
    email: string;
    password: string;
}

interface myContext {
    res: Response
    req: Request
}
export const resolvers: ResolverMap = {
    Query: {
        hello: (_: any, { name }: HelloQueryArgs) => `Bye ${name || "World"}`
    },
    Mutation: {
        register: async (_: any, args: RegisterMutationArgs, __, { req, res }) => {
            //check if input is correct
            console.log('req')
            console.log('here')

            let userSchema = yup.object().shape({
                firstName: yup.string().required().max(255),
                email: yup.string().email().required(),
                lastName: yup.string().required().max(255),
                password: yup.string().required().min(6).max(255),
            });

            try {
                await userSchema.validate(args, { abortEarly: false })
            } catch (err) {
                console.log(formatYupError(err))
                return { user: null, error: formatYupError(err) }
            }

            const { firstName, lastName, email, password } = args


            //check if the user exists
            console.log('before userExists')
            const userExists = await User.findOne({ where: { email }, select: ["id"] })
            console.log(userExists)
            if (userExists) {
                console.log('user exists')
                return { user: null, error: [{ path: 'email', message: 'Looks like this eamil is arleady associated with an account' }] }
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({
                email,
                firstName,
                lastName,
                password: hashedPassword
            })

            await user.save()

            return { user, error: null }
        },
        login: async (_: any, { email, password }: LoginMutationArgs, context) => {

            const user = await User.findOne({ where: { email } })
            console.log('here')
            if (!user) {
                return {
                    user: null, error: [{ path: 'email', message: 'Email or password is wrong' }]
                }
            }
            //check that passowrd is correct
            const match: boolean = await bcrypt.compare(password, user.password);
            if (!match) {
                return { user: null, error: [{ path: 'email', message: 'Email or password is wrong' }] }
            }

            //@ts-ignore
            console.log(context.req)

            // create refresh token
            //@ts-ignore
            context.res.cookie('rrrt', sign({ userId: user.id }, 'somethingelse', { expiresIn: '7d' }), { httpOnly: true })

            //create acess token
            return { acessToken: sign({ userId: user.id }, 'signature', { expiresIn: '60m' }), user, error: null }
        }
    }
}
