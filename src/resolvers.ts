import * as bcrypt from 'bcrypt';
import { User } from './entity/User';
interface HelloQueryArgs {
    name: string
}

interface RegisterMutationArgs{
    email: string;
    password:string;
}

interface ResolverMap {
    [key: string]: {
        [key: string]: (parent: any, args: any, context: {}, info: any) => any
    }
}

export const resolvers: ResolverMap = {
    Query: {
        hello: (_: any, { name }: HelloQueryArgs) => `Bye ${name || "World"}`
    },
    Mutation: {
        register: async (_:any, {email, password}:RegisterMutationArgs) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({
                email,
                password: hashedPassword
            })
            await user.save()
            return email + password
        }
    }
}
