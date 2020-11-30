import dotenv from "dotenv";
import { User } from './entity/User';
dotenv.config();

interface Config {
    port: number;
    database: {
        username: string;
        password: string;
        database: string;
    }

}

const config: any = {
    port: parseInt(process.env.PORT!, 10),
    database: {
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        type: "postgres",
        host: "localhost",
        port: 5432,
        synchronize: true,
        logging: true,
        entities: ['src/entity/**/*.ts'],
        migrations: ["src/migration/**/*.ts"],
        subscribers: ["src/subscriber/**/*.ts"],
        cli: {
            entitiesDir: "src/entity",
            migrationsDir: "src/migration",
            subscribersDir: "src/subscriber"
        }

    }
}

export default config
