import {ValidationError} from 'yup';

interface Error{
    path: string;
    message: string;
}

export function formatYupError(err: ValidationError){
    const errors: Array<Error> = []

    err.inner.forEach(e => {
        errors.push({
            path: e.path,
            message: e.message,
        })
    })

    return errors
}
