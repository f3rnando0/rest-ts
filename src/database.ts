import * as builder from 'knex'
import { Knex } from 'knex'
import { env } from './env'

const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL!,
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: env.DATABASE_MIGRATIONS_PATH!,
    }
}

const knex = builder.default(config)

export { knex, config }