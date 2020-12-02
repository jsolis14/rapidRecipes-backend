import * as bcrypt from 'bcrypt';
import { User } from './entity/User';
import * as yup from 'yup';
import { validate } from 'uuid';
import { formatYupError } from './utils/formatYupError';
interface HelloQueryArgs {
    name: string
}

interface RegisterMutationArgs{
    email: string;
    password:string;
    firstName: string;
    lastName: string;
}

interface LoginMutationArgs{

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
        register: async (_:any, args:RegisterMutationArgs) => {
            //check if input is correct
            let userSchema = yup.object().shape({
                firstName: yup.string().required().max(255),
                email: yup.string().email(),
                lastName: yup.string().required().max(255),
                password: yup.string().required().min(6).max(255),
              });

            try {
                await userSchema.validate(args, {abortEarly: false})
            } catch(err){
                return formatYupError(err)
            }

            const {firstName, lastName, email, password} = args

            //check if the user exists
            const userExists = User.findOne({where: {email}, select: ["id"]})

            if (userExists){
                return [{path:'email', message: 'Looks like this eamil is arleady associated with an account'}]
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({
                email,
                firstName,
                lastName,
                password: hashedPassword
            })
            await user.save()
            return null
        },
    }
}
