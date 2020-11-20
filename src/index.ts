import "reflect-metadata"
import express from 'express';
import config from './config';
import { createConnection, Connection } from "typeorm";
import { User } from './entity/User';


const app = express()

app.listen(config.port, async () => {
    console.log(`server is listening on port ${config.port}`)

    const connection = await createConnection(config.database);



    const user = new User();
    user.firstName = 'Jesse'
    user.lastName = 'Solis'
    user.age = 23
    user.email = 'email@email.com'
    user.password = 'sadsade213123fsdfwe3'
    await connection.manager.save(user);
    console.log(`saved a new user with id: ${user.id}`)

})
